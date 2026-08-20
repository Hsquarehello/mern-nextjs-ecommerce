"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Package, Calendar, ArrowRight, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  _id: string;
  amount: number;
  currency: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${API_URL}/orders/my-orders`, {
          withCredentials: true,
        });

        // Populate orders list from backend pagination payload
        setOrders(response.data.orders || []);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        setError("Unable to load your order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper function to return visual badges according to order status
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

  // Loading State with Skeletons
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-9 w-40" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view status of your recent purchases
          </p>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <Card className="text-center p-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
            <div className="p-4 rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">No orders yet</CardTitle>
              <p className="text-sm text-muted-foreground">
                When you place an order, it will appear here.
              </p>
            </div>
            <Button render={<Link href="/" />} className="mt-4">
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  {/* Order Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-base">
                        Order #{order._id.slice(-8)}
                      </span>
                      {getOrderStatusBadge(order.orderStatus)}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" />
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <span className="text-lg font-bold text-foreground">
                      ${Number(order.amount).toFixed(2)}
                    </span>
                    <Button
                      render={<Link href={`/orders/${order._id}`} />}
                      variant="ghost"
                      size="sm"
                      className="gap-1.5">
                      View Details <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
