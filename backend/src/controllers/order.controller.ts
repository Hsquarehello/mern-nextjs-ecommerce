import type { Request, Response } from "express";
import Order from "../models/Order.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderItems, totalAmount, paymentIntentId } = req.body;

    if (!orderItems || orderItems.length === 0) {
      throw new AppError("No items in order", 400);
    }

    const order = new Order({
      orderItems,
      totalAmount,
      paymentIntentId,
      isPaid: true,
      paidAt: new Date(),
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  },
);
