import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import path from "path";
import fs from "fs";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { APP_ROOT, DIST_DIR, UPLOAD_DIR, SESSION_SECRET } from "./config.js";

export async function createApp(): Promise<Express> {
  const app: Express = express();

  app.use(
    pinoHttp({
      logger,
      serializers: {
        req(req) {
          return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
        },
        res(res) {
          return { statusCode: res.statusCode };
        },
      },
    }),
  );

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
    }),
  );

  app.use("/api", router);

  if (process.env.NODE_ENV === "production") {
    if (fs.existsSync(UPLOAD_DIR)) {
      app.use("/images", express.static(UPLOAD_DIR));
      logger.info({ UPLOAD_DIR }, "Serving images from");
    }

    if (fs.existsSync(DIST_DIR)) {
      app.use(express.static(DIST_DIR));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(DIST_DIR, "index.html"));
      });
      logger.info({ DIST_DIR }, "Serving frontend from");
    } else {
      logger.warn({ DIST_DIR }, "Frontend dist not found — run build first");
    }
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      configFile: path.resolve(APP_ROOT, "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    logger.info("Vite middleware active (dev mode)");
  }

  return app;
}
