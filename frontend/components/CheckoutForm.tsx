"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Stripe ဖြင့် ငွေပေးချေမှုကို အတည်ပြုခြင်း
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Payment အဆင်ပြေပါက success page သို့ redirect ပြုလုပ်ပါမည်
        return_url: `${window.location.origin}/success`,
      },
      redirect: "if_required", // Page redirect မလိုအပ်ဘဲ client-side တွင် ကိုင်တွယ်ရန်
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsCompleted(true);
      clearCart(); // Payment ပြီးမြောက်ပါက Cart ကို ရှင်းထုတ်မည်
      setIsProcessing(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl text-center">
        <h3 className="text-xl font-bold mb-2">🎉 Payment Successful!</h3>
        <p className="text-sm">
          Thank you for your purchase. Your order is being processed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element (Card, Apple Pay, etc.) */}
      <PaymentElement />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center">
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Payment...</span>
          </div>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
}
