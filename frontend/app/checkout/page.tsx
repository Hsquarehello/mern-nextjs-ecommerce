"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "@/components/CheckoutForm";
import Link from "next/link";

// Shadcn UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Stripe Publishable Key ကို Load လုပ်ပါ
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export default function CheckoutPage() {
  const { cart, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loadingSecret, setLoadingSecret] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Cart ထဲတွင် စုစုပေါင်း ဈေးနှုန်း ရှိပါက Backend ထံမှ Payment Intent Client Secret တောင်းယူမည်
  useEffect(() => {
    if (totalPrice > 0) {
      setLoadingSecret(true);
      setFetchError(null);

      axios
        .post("http://localhost:5000/api/payment/create-payment-intent", {
          amount: Math.round(totalPrice * 100), // Stripe တွင် Cents အနေဖြင့် တွက်သဖြင့် * 100 မြှောက်ပေးရပါမည်
          items: cart.map((item) => ({
            _id: item._id,
            price: item.price,
            quantity: item.quantity,
          })),
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          console.error("PaymentIntent Error:", err);
          setFetchError(
            "Failed to initialize payment form. Please check backend connection.",
          );
        })
        .finally(() => {
          setLoadingSecret(false);
        });
    }
  }, [totalPrice]);

  // Cart ကွန်တိန်နာ ထဲတွင် ပစ္စည်းမရှိသေးပါက ပြသမည့် UI
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Your Cart is Empty
            </CardTitle>
            <CardDescription className="mt-2">
              Looks like you haven't added any products to your cart yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button render={<Link href="/" />} className="w-full">
              Return to Shop
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Cart Items Summary with Shadcn Table */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
              <CardDescription>
                Review your selected items and quantities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item._id}>
                      {/* Product Info */}
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-md bg-muted"
                          />
                          <div>
                            <span className="font-bold text-sm block line-clamp-1">
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Quantity Controls */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }>
                            -
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }>
                            +
                          </Button>
                        </div>
                      </TableCell>

                      {/* Subtotal Price */}
                      <TableCell className="text-right font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>

                      {/* Remove Button */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromCart(item._id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Total Amount Footer */}
              <div className="pt-6 mt-4 border-t flex justify-between items-center">
                <span className="text-base font-semibold text-muted-foreground">
                  Total Amount:
                </span>
                <span className="text-2xl font-extrabold text-blue-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Stripe Payment Integration with Shadcn Card */}
        <div className="lg:col-span-5">
          <Card className="shadow-sm sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Payment Details
              </CardTitle>
              <CardDescription>
                Enter your payment information below
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSecret && (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm mt-3">
                    Initializing Stripe Payment...
                  </p>
                </div>
              )}

              {fetchError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
                  {fetchError}
                </div>
              )}

              {clientSecret && !loadingSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: { theme: "stripe" } }}>
                  <CheckoutForm />
                </Elements>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
