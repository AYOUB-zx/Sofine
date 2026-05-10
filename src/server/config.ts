import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);

export const APP_ROOT =
  process.env.NODE_ENV === "production"
    ? __dir
    : resolve(__dir, "../..");

export const UPLOAD_DIR = resolve(APP_ROOT, "public", "images");
export const DIST_DIR = resolve(APP_ROOT, "dist", "public");
export const PORT = Number(process.env.PORT) || 8080;
export const SESSION_SECRET = "tabia-secret-2024";
export const ADMIN_USERNAME = "soufiane";
export const ADMIN_PASSWORD = "soufiane zx";
