import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import statsRouter from "./stats";
import authRouter from "./auth";
import easyordersRouter from "./easyorders";
import reviewsRouter from "./reviews";
import settingsRouter from "./settings";
import imageSearchRouter from "./image-search";
import couponsRouter from "./coupons";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(ordersRouter);
router.use(statsRouter);
router.use(easyordersRouter);
router.use(reviewsRouter);
router.use(settingsRouter);
router.use(imageSearchRouter);
router.use(couponsRouter);
router.use(uploadRouter);

export default router;
