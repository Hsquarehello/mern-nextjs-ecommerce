"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Shadcn UI Components & Lucide Icons
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface CheckoutFormProps {
  amount?: number;
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

    const redirectUrl = `${window.location.origin}/success`;

    // 2. Stripe Payment Confirm ပြုလုပ်ခြင်း
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: redirectUrl,
      },
    });

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 1. Customer Email (Guest User များအတွက် Email တောင်းရန်) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground block">
          Contact Information
        </label>
        <div className="p-3.5 rounded-xl border bg-card text-card-foreground shadow-sm">
          <LinkAuthenticationElement />
        </div>
      </div>

      {/* 2. Shipping Address (ပို့ဆောင်ရမည့် လိပ်စာ တောင်းရန်) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground block">
          Shipping Address
        </label>
        <div className="p-3.5 rounded-xl border bg-card text-card-foreground shadow-sm">
          <AddressElement options={{ mode: "shipping" }} />
        </div>
      </div>

      {/* 3. Stripe Payment Element (Card / Other Payment Methods) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground block">
          Payment Details
        </label>
        <div className="p-3.5 rounded-xl border bg-card text-card-foreground shadow-sm">
          <PaymentElement />
        </div>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
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
