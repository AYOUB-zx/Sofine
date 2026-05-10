import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { UPLOAD_DIR } from "../config.js";

const router: IRouter = Router();

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const unique = `product_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("نوع الملف غير مدعوم"));
  },
});

router.post("/upload/image", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Unauthorized" }); return; }
  upload.single("image")(req, res, (err) => {
    if (err) { res.status(400).json({ error: err.message || "فشل في رفع الصورة" }); return; }
    if (!req.file) { res.status(400).json({ error: "لم يتم إرسال صورة" }); return; }
    res.json({ url: `/images/${req.file.filename}` });
  });
});

export default router;
