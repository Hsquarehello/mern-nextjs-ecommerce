import dotenv from "dotenv";
dotenv.config();
import type { Request, Response } from "express";
import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-07-29.dahlia" as any,
});

export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      items,
      shippingAddress,
      customerEmail,
      currency = "usd",
    } = req.body;



    if (!items || !Array.isArray(items) || items.length === 0) {
      res
        .status(400)
        .json({ success: false, message: "Cart items are required" });
      return;
    }

    // Backend မှ ပမာဏကို စိစစ်တွက်ချက်ခြင်း (Cents သို့ ပြောင်းခြင်း)
    const rawTotal = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0,
    );
    const totalAmount = Math.round(rawTotal * 100);

    // Auth Middleware မှ ရရှိသော User ID (ရှိလျှင်)
    const userId = (req as any).user?.id || (req as any).user?._id || "";

    // 3. Metadata character limit (500 chars) မကျော်စေရန် လိုအပ်သော data သာ သိမ်းခြင်း
    const metadataItems = items.map((item: any) => ({
      id: item.productId || item._id,
      name: item.name || "Product",
      qty: item.quantity,
      p: item.price,
      img: item.imageUrl || "",
    }));

    // 4. Stripe PaymentIntent ဖန်တီးခြင်း
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency,
      receipt_email: customerEmail || undefined,
      automatic_payment_methods: { enabled: true },
      // ⚠️ Webhook မှ DB Order ဆောက်ရန်အတွက် metadata ထည့်သွင်းပေးခြင်း
      metadata: {
        userId: userId ? userId.toString() : "",
        items: JSON.stringify(metadataItems),
      },
    });

    console.log(paymentIntent)

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  },
);
