import { Router, type IRouter } from "express";
import { productsStore } from "../db/store.js";

const router: IRouter = Router();

router.get("/products", (_req, res): void => {
  res.json(productsStore.getAll());
});

router.post("/products", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { name, description, price, imageUrl, inStock } = req.body;
  if (!name || price == null) { res.status(400).json({ error: "name و price مطلوبان" }); return; }
  const product = productsStore.create({
    name,
    description: description ?? null,
    price: Number(price),
    imageUrl: imageUrl ?? null,
    inStock: inStock !== false,
  });
  res.status(201).json(product);
});

router.get("/products/:id", (req, res): void => {
  const product = productsStore.getById(Number(req.params.id));
  if (!product) { res.status(404).json({ error: "المنتج غير موجود" }); return; }
  res.json(product);
});

router.patch("/products/:id", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Unauthorized" }); return; }
  const product = productsStore.update(Number(req.params.id), req.body);
  if (!product) { res.status(404).json({ error: "المنتج غير موجود" }); return; }
  res.json(product);
});

router.delete("/products/:id", (req, res): void => {
  const session = (req as any).session;
  if (!session?.adminUsername) { res.status(401).json({ error: "Unauthorized" }); return; }
  const deleted = productsStore.delete(Number(req.params.id));
  if (!deleted) { res.status(404).json({ error: "المنتج غير موجود" }); return; }
  res.sendStatus(204);
});

export default router;
