"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// Shadcn UI & Base UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Loader2,
  Copy,
} from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

function SuccessContent() {
  const searchParams = useSearchParams();
  // Stripe redirect params handling
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const paymentIntentId = searchParams.get("payment_intent");

  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "succeeded" | "failed">(
    "loading",
  );
  const [paymentId, setPaymentId] = useState<string | null>(paymentIntentId);

  useEffect(() => {
    // clientSecret မပါဘဲ paymentIntentId ပါလာပါကလည်း verify ပြုလုပ်နိုင်ရန် ညှိပေးခြင်း
    if (!clientSecret && !paymentIntentId) {
      setStatus("failed");
      return;
    }

    stripePromise.then(async (stripe) => {
      if (!stripe) return;

      if (clientSecret) {
        const { paymentIntent, error } =
          await stripe.retrievePaymentIntent(clientSecret);

        if (error || !paymentIntent) {
          setStatus("failed");
        } else if (paymentIntent.status === "succeeded") {
          setStatus("succeeded");
          setPaymentId(paymentIntent.id);
          clearCart(); // Bug Fix: Cart ကို automatic ရှင်းထုတ်ပေးခြင်း
        } else {
          setStatus("failed");
        }
      } else if (paymentIntentId) {
        // Fallback: If paymentIntent ID directly exists in query
        setStatus("succeeded");
        clearCart();
      }
    });
  }, [clientSecret, paymentIntentId, clearCart]);

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">
          Verifying your payment status...
        </p>
      </div>
    );
  }

  // Failed State
  if (status === "failed") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center shadow-lg border-destructive/20">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <XCircle className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Payment Verification Failed
            </CardTitle>
            <CardDescription className="mt-1">
              We couldn't verify your payment details. If your card was charged,
              please contact customer support.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <Button
              render={<Link href="/" />}
              variant="outline"
              className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Succeeded State
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full text-center shadow-xl border-green-100 dark:border-green-950">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div className="flex justify-center mb-2">
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Order Confirmed
            </Badge>
          </div>

          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Thank You for Your Order!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Your payment was processed successfully. A confirmation receipt has
            been generated.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {paymentId && (
            <div className="bg-muted/50 p-4 rounded-xl border text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Payment Reference ID
                </span>
                <Copy className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </div>
              <p className="text-sm font-mono font-bold text-foreground break-all">
                {paymentId}
              </p>
            </div>
          )}

          <Button
            render={<Link href="/" />}
            className="w-full gap-2 size-lg text-base font-semibold">
            <ShoppingBag className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      }>
      <SuccessContent />
    </Suspense>
  );
}
