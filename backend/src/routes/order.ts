import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrderById,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authorizeAdmin, protect } from "../middlewares/auth.middleware.js";
const router = Router();

// Customer routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/my-orders/:id", protect, getMyOrderById);

// Admin routes
router.get("/", protect, authorizeAdmin, getAllOrders);
router.get("/:id", protect, authorizeAdmin, getOrderById);
router.patch("/:id/status", protect, authorizeAdmin, updateOrderStatus);

export default router;
