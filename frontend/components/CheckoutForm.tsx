"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Shadcn UI & Base UI Components
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface CheckoutFormProps {
  amount?: number; // Total Amount (Optional)
}

export default function CheckoutForm({ amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // 1. Stripe Elements Form Validation စစ်ဆေးခြင်း
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(
        submitError.message || "Please fill in all required payment details.",
      );
      setIsProcessing(false);
      return;
    }

    // Dynamic Origin URL ကို ရယူခြင်း (Localhost သို့မဟုတ် Production Domain)
    const redirectUrl = `${window.location.origin}/success`;

    // Stripe ဖြင့် Payment ကို Confirm ပြုလုပ်ခြင်း
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: redirectUrl,
      },
    });

    // Error ရှိပါကသာ ဤနေရာသို့ ရောက်ရှိမည် ဖြစ်ပြီး အောင်မြင်ပါက /success သို့ အလိုအလျောက် Redirect ဖြစ်သွားမည်
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(
          error.message || "An error occurred with your payment.",
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element */}
      <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
        <PaymentElement />
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button using Base UI Button Component */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-11 text-base font-semibold shadow-md gap-2">
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="h-5 w-5" />
            <span>{amount ? `Pay $${amount.toFixed(2)}` : "Pay Now"}</span>
          </>
        )}
      </Button>
    </form>
  );
}
