import type { Request, Response } from "express";
import Order from "../models/Order.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { items, amount, paymentIntentId, customerEmail, shippingAddress } =
      req.body;

    if (!items || items.length === 0) {
      throw new AppError("No items in order", 400);
    }

    const order = new Order({
      user: req.user?._id, // Auth middleware မှ ပါလာသော User ID (ရှိလျှင်)
      items,
      amount,
      paymentIntentId,
      customerEmail,
      shippingAddress,
      paymentStatus: "paid",
      orderStatus: "Processing",
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  },
);

// 2. [ADMIN] Order အားလုံးကို ဆွဲထုတ်ခြင်း
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  },
);

// 3. [ADMIN] Order တစ်ခု၏ အသေးစိတ် ကြည့်ခြင်း
export const getOrderById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      throw new AppError("Order not found", 404);
    }
    res.status(200).json(order);
  },
);

// 4. [ADMIN] Order Status Update လုပ်ခြင်း (ဥပမာ - Processing မှ Shipped သို့)
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  },
);
