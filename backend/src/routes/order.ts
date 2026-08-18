import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authorizeAdmin, protect } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/", protect, createOrder);
router.get("/", protect, authorizeAdmin, getAllOrders);
router.get("/:id", protect, authorizeAdmin, getOrderById);
router.patch("/:id/status", protect, authorizeAdmin, updateOrderStatus);

export default router;
