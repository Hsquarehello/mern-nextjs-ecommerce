"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("payment_intent_client_secret");

  const [status, setStatus] = useState<"loading" | "succeeded" | "failed">(
    "loading",
  );
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (!clientSecret) {
      setStatus("failed");
      return;
    }

    // Stripe ဖြင့် PaymentIntent Status ကို အတည်ပြုစစ်ဆေးခြင်း
    stripePromise.then(async (stripe) => {
      if (!stripe) return;

      const { paymentIntent, error } =
        await stripe.retrievePaymentIntent(clientSecret);

      if (error || !paymentIntent) {
        setStatus("failed");
      } else if (paymentIntent.status === "succeeded") {
        setStatus("succeeded");
        setPaymentId(paymentIntent.id);
      } else {
        setStatus("failed");
      }
    });
  }, [clientSecret]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Verifying your payment status...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center my-12">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✕
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Verification Failed
        </h1>
        <p className="text-gray-500 text-sm mt-2 mb-6">
          We couldn't verify your payment details. If you were charged, please
          contact customer support.
        </p>
        <Link
          href="/"
          className="inline-block bg-gray-900 hover:bg-black text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center my-12">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
        ✓
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900">
        Thank You for Your Order!
      </h1>
      <p className="text-gray-600 mt-2 text-sm">
        Your payment was processed successfully. A confirmation email will be
        sent shortly.
      </p>

      {/* Payment Reference ID */}
      {paymentId && (
        <div className="bg-gray-50 p-4 rounded-xl my-6 border border-gray-100 text-left">
          <span className="text-xs text-gray-400 block font-medium uppercase tracking-wider">
            Payment Reference ID
          </span>
          <span className="text-sm font-mono text-gray-800 break-all font-semibold">
            {paymentId}
          </span>
        </div>
      )}

      <div className="space-y-3 pt-2">
        <Link
          href="/"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
      <SuccessContent />
    </Suspense>
  );
}
