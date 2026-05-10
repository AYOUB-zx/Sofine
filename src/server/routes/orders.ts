import { Router, type IRouter } from "express";
import { ordersStore, productsStore } from "../db/store.js";

const router: IRouter = Router();

router.get("/orders", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Unauthorized" }); return; }
  res.json(ordersStore.getAll());
});

router.post("/orders", (req, res): void => {
  const { productId, firstName, lastName, phone, wilaya, quantity } = req.body;
  if (!productId || !firstName || !lastName || !phone || !wilaya || !quantity) {
    res.status(400).json({ error: "جميع الحقول مطلوبة" }); return;
  }
  const product = productsStore.getById(Number(productId));
  if (!product) { res.status(404).json({ error: "المنتج غير موجود" }); return; }
  const order = ordersStore.create({
    productId: product.id,
    productName: product.name,
    productImageUrl: product.imageUrl,
    firstName,
    lastName,
    phone,
    wilaya,
    quantity: Number(quantity),
    totalPrice: product.price * Number(quantity),
    status: "pending",
  });
  res.status(201).json(order);
});

router.get("/orders/:id", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Unauthorized" }); return; }
  const order = ordersStore.getById(Number(req.params.id));
  if (!order) { res.status(404).json({ error: "الطلب غير موجود" }); return; }
  res.json(order);
});

router.delete("/orders/:id", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Unauthorized" }); return; }
  const deleted = ordersStore.delete(Number(req.params.id));
  if (!deleted) { res.status(404).json({ error: "الطلب غير موجود" }); return; }
  res.sendStatus(204);
});

router.patch("/orders/:id", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { status } = req.body;
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) { res.status(400).json({ error: "حالة غير صحيحة" }); return; }
  const order = ordersStore.updateStatus(Number(req.params.id), status);
  if (!order) { res.status(404).json({ error: "الطلب غير موجود" }); return; }
  res.json(order);
});

export default router;
