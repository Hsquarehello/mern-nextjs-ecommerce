import { Router } from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/create-payment-intent", optionalAuth, createPaymentIntent);
export default router;
