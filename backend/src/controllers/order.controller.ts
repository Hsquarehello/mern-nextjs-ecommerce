import type { Request, Response } from 'express';
import Order from '../models/Order.js';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderItems, totalAmount, paymentIntentId } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No items in order' });
      return;
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
  } catch (error: any) {
    res.status(500).json({ message: 'Order Saving Failed', error: error.message });
  }
};