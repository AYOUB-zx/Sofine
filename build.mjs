import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm } from "node:fs/promises";
import { execSync } from "node:child_process";

globalThis.require = createRequire(import.meta.url);

const appDir = path.dirname(fileURLToPath(import.meta.url));

async function buildAll() {
  console.log("Building frontend (Vite)...");
  execSync("node_modules/.bin/vite build", {
    stdio: "inherit",
    cwd: appDir,
  });

  console.log("Building server (esbuild)...");
  const outFile = path.resolve(appDir, "index.js");
  await rm(outFile, { force: true });

  await esbuild({
    entryPoints: [path.resolve(appDir, "src/server/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: outFile,
    logLevel: "info",
    external: [
      "vite",
      "*.node",
      "sharp",
      "better-sqlite3",
      "sqlite3",
      "canvas",
      "bcrypt",
      "argon2",
      "fsevents",
      "pg-native",
      "bufferutil",
      "utf-8-validate",
      "lightningcss",
    ],
    sourcemap: "linked",
    plugins: [
      esbuildPluginPino({ transports: ["pino-pretty"] }),
    ],
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
    },
  });

  console.log("Build complete! Run with: node index.js");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
