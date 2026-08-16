import express from "express";
import type { Request, Response } from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

// Stripe Webhook Endpoint (Must use express.raw for signature verification)
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      if (!sig || !endpointSecret) {
        res
          .status(400)
          .send("Webhook Error: Missing Stripe signature or secret key");
        return;
      }

      // Stripe မှ လာသော Request အစစ်အမှန် ဟုတ်မဟုတ် Signature စစ်ဆေးခြင်း
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle PaymentIntent Succeeded Event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
      console.log(
        `🔔 Payment successful for Amount: $${paymentIntent.amount / 100}`,
      );

      try {
        // PaymentIntent တွင် ပါရှိသော Metadata မှ Items များကို ဖြန့်ယူခြင်း
        const cartItems = paymentIntent.metadata?.items
          ? JSON.parse(paymentIntent.metadata.items)
          : [];

        // Order သစ်ကို MongoDB ထဲသို့ သိမ်းဆည်းခြင်း
        const newOrder = new Order({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Cents ကို Dollars သို့ ပြန်ပြောင်းခြင်း
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          customerEmail:
            paymentIntent.receipt_email ||
            paymentIntent.metadata?.customerEmail ||
            "N/A",
          items: cartItems,
        });

        await newOrder.save();
        console.log(
          `✅ Order saved successfully to Database! Order ID: ${newOrder._id}`,
        );
      } catch (dbError: any) {
        console.error(`❌ Database Save Error: ${dbError.message}`);
      }
    }

    // Stripe သို့ Event လက်ခံရရှိကြောင်း 200 Response ပြန်ပေးခြင်း
    res.status(200).json({ received: true });
  },
);

export default router;
