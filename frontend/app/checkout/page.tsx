"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "@/components/CheckoutForm";
import Link from "next/link";

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

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="text-gray-500 mt-2 mb-6">
          Looks like you haven't added any products yet.
        </p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Cart Items Summary */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
            Order Summary
          </h2>

          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div
                key={item._id}
                className="py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                      {item.name}
                    </h3>
                    <p className="text-blue-600 font-bold text-sm mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm">
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold text-sm text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm">
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium p-1">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-lg font-bold text-gray-900">
            <span>Total Amount:</span>
            <span className="text-2xl text-blue-600">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right Side: Stripe Payment Integration */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Payment Details
          </h2>

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
        </div>
      </div>
    </div>
  );
}
