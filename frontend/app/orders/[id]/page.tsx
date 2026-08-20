"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface OrderDetail {
  _id: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
  customerEmail: string;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(
          `${API_URL}/orders/my-orders/${orderId}`,
          { withCredentials: true },
        );
        setOrder(response.data);
      } catch (err: any) {
        console.error("Failed to fetch order details:", err);
        setError(
          err.response?.data?.message || "Failed to load order details.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  // Status badge styling helper
  const getOrderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700">
            {status}
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">{status}</Badge>
        );
      case "processing":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Loading State Skeleton
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State UI
  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <p className="text-destructive font-semibold text-lg">
          {error || "Order not found."}
        </p>
        <Button render={<Link href="/orders" />} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
          <p className="text-sm text-muted-foreground">Order ID: {order._id}</p>
        </div>
        <Button
          render={<Link href="/orders" />}
          variant="outline"
          size="sm"
          className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>

      {/* Order Status & Metadata Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Order Date
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Order Status
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-1">
            {getOrderStatusBadge(order.orderStatus)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Payment Status
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-1">
            <Badge
              variant="outline"
              className="uppercase border-emerald-600 text-emerald-600 font-semibold">
              {order.paymentStatus}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Address Section */}
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2 pb-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-foreground">
          {order.shippingAddress ? (
            <>
              <p>
                <span className="font-medium">Name:</span>{" "}
                {order.shippingAddress.fullName || "N/A"}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {order.shippingAddress.phone || "N/A"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground italic">
              No shipping address provided for this order.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Purchased Items List */}
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2 pb-3">
          <Package className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="py-4 flex justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-14 h-14 bg-muted rounded-md border flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Qty: {item.quantity} × ${(item.price).toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-sm">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          {/* Grand Total */}
          <div className="pt-4 mt-4 flex justify-between items-center text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-primary">
              ${(order.amount).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
