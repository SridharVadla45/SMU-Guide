import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createPaymentIntent, confirmPayment, getUserPayments } from "../controllers/payment.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/create-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);
router.get("/", getUserPayments);

export { router as paymentRouter };
