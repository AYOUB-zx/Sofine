import { Router } from "express";
import healthRouter from "./health.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";
import adminRouter from "./admin.js";
import uploadRouter from "./upload.js";

const router = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(adminRouter);
router.use(uploadRouter);

export default router;
