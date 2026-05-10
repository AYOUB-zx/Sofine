import { Router, type IRouter } from "express";
import { productsStore, ordersStore } from "../db/store.js";
import { logger } from "../lib/logger.js";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "../config.js";

const router: IRouter = Router();

router.post("/admin/login", (req, res): void => {
  const { username, password } = req.body;
  if (!username || !password) { res.status(400).json({ error: "username و password مطلوبان" }); return; }
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    return;
  }
  (req as any).session.adminUsername = username;
  req.log.info({ username }, "Admin logged in");
  res.json({ username });
});

router.post("/admin/logout", (req, res): void => {
  (req as any).session.destroy((err: Error) => {
    if (err) logger.error({ err }, "Error destroying session");
  });
  res.json({ success: true });
});

router.get("/admin/me", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Not authenticated" }); return; }
  res.json({ username: session.adminUsername });
});

router.get("/admin/stats", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { totalOrders, pendingOrders, totalRevenue } = ordersStore.stats();
  res.json({
    totalProducts: productsStore.getAll().length,
    totalOrders,
    pendingOrders,
    totalRevenue,
  });
});

export default router;
