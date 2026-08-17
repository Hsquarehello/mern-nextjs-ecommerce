import dotenv from "dotenv";
dotenv.config();
import type { Request, Response } from "express";
import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { items, currency = "usd" } = req.body;

    // Backend မှ ပမာဏကို စိစစ်တွက်ချက်ခြင်း (Cents သို့ ပြောင်းခြင်း)
    const totalAmount =
      items.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0,
      ) * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  },
);
