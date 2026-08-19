import express from "express";
import type { Request, Response } from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-07-29.dahlia" as any,
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
        // 1. Duplicate Order ဖြစ်မသွားအောင် စစ်ဆေးခြင်း (Idempotency Guard)
        const existingOrder = await Order.findOne({
          paymentIntentId: paymentIntent.id,
        });

        if (existingOrder) {
          console.log(
            `⚠️ Order already exists for PaymentIntent: ${paymentIntent.id}`,
          );
          res
            .status(200)
            .json({ received: true, message: "Order already processed" });
          return;
        }

        // PaymentIntent တွင် ပါရှိသော Metadata မှ Items များကို ဖြန့်ယူခြင်း
        const metadata = paymentIntent.metadata || {};
        const cartItems = metadata.items ? JSON.parse(metadata.items) : [];
        const shippingAddress = metadata.shippingAddress
          ? JSON.parse(metadata.shippingAddress)
          : undefined;
        const userId = metadata.userId || undefined;

        const stripeShipping = paymentIntent.shipping;
        const formattedShippingAddress = stripeShipping
          ? {
              name: stripeShipping.name,
              line1: stripeShipping.address?.line1 || "",
              line2: stripeShipping.address?.line2 || "",
              city: stripeShipping.address?.city || "",
              state: stripeShipping.address?.state || "",
              postal_code: stripeShipping.address?.postal_code || "",
              country: stripeShipping.address?.country || "",
            }
          : undefined;

        // 4. LinkAuthenticationElement မှ ပို့ပေးလိုက်သော Email ကို ရယူခြင်း
        // Note: receipt_email မပါလာပါက latest_charge ထဲမှ email ကို ယူပါမည်
        let customerEmail =
          paymentIntent.receipt_email || metadata.customerEmail;

        if (!customerEmail && paymentIntent.latest_charge) {
          const charge = await stripe.charges.retrieve(
            paymentIntent.latest_charge as string,
          );
          customerEmail =
            charge.billing_details?.email || charge.receipt_email || "N/A";
        }

        // ✅ အတိုချုံ့ထားသော metadata (id, p, q, img) မှ Schema ပုံစံအတိုင်း ပြန် mapping လုပ်ခြင်း
        const formattedItems = cartItems.map((item: any) => ({
          product: item.id || item._id,
          name: item.name,
          price: Number(item.p ?? item.price),
          quantity: Number(item.qty ?? item.quantity ?? 1),
          imageUrl: item.img || "",
        }));

        // Order သစ်ကို MongoDB ထဲသို့ သိမ်းဆည်းခြင်း
        const newOrder = new Order({
          user: userId,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Cents ကို Dollars သို့ ပြန်ပြောင်းခြင်း
          currency: paymentIntent.currency,
          paymentStatus: "paid",
          orderStatus: "Processing",
          customerEmail: customerEmail || "N/A",
          items: formattedItems,
          shippingAddress: formattedShippingAddress,
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
