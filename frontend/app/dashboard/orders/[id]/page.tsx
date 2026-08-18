"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  Truck,
  User,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Interface Definitions
interface IOrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  } | null;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface IOrder {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  customerEmail?: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddress?: IShippingAddress;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15+ App Router Params Unwrapping
  const { id: orderId } = use(params);

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Order Details ဆွဲထုတ်သည့် Function
  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        withCredentials: true,
      });

      if (response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  // Order Delivery Status Update လုပ်သည့် Handler
  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus || !order) return;

    try {
      setUpdating(true);
      const response = await axios.patch(
        `${API_URL}/orders/${order._id}/status`,
        { orderStatus: newStatus },
        { withCredentials: true },
      );

      if (response.data.success) {
        setOrder((prev) =>
          prev
            ? { ...prev, orderStatus: newStatus as IOrder["orderStatus"] }
            : null,
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Status Badge Render Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Processing":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" /> Processing
          </Badge>
        );
      case "Shipped":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200">
            <Truck className="w-3 h-3 mr-1" /> Shipped
          </Badge>
        );
      case "Delivered":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold">Order Not Found</h2>
        <p className="text-muted-foreground text-sm">
          The order you are looking for does not exist or has been removed.
        </p>
        <Button render={<Link href="/dashboard/orders" />} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Button
            render={<Link href="/dashboard/orders" />}
            variant="ghost"
            size="sm"
            className="-ml-2 mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            {renderStatusBadge(order.orderStatus)}
          </div>
          <p className="text-xs text-muted-foreground">
            Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
          </p>
        </div>

        {/* Change Delivery Status Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Change Status:</span>
          <Select
            value={order.orderStatus}
            disabled={updating}
            onValueChange={handleStatusChange}>
            {/* Shadcn UI Updated Spec: asChild ကို ဖြုတ်ထားပါသည် */}
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Ordered Products List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5" /> Order Items (
                {order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => {
                    const imageSrc = item.imageUrl || "/placeholder.png";
                    console.log(order);
                    const itemTotal =
                      (item.price ?? 0) * item.quantity;

                    return (
                      <TableRow key={item._id || index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted border shrink-0">
                              <Image
                                src={imageSrc}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ID: {item._id || "N/A"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">
                          ${itemTotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment & Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 capitalize">
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Intent ID</span>
                <span className="font-mono text-xs">
                  {order.paymentIntentId}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total Amount Paid</span>
                <span>
                  ${order.amount.toFixed(2)} {order.currency.toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Customer & Shipping Details */}
        <div className="space-y-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" /> Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">
                  {order.user?.name || "Guest Checkout"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {order.user?.email ||
                    order.customerEmail ||
                    "No Email Provided"}
                </p>
              </div>
              {order.user?._id && (
                <div className="pt-2">
                  <span className="text-xs text-muted-foreground block">
                    User Account ID:
                  </span>
                  <span className="font-mono text-xs">{order.user._id}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {order.shippingAddress ? (
                <>
                  <p className="font-medium">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <Separator className="my-2" />
                  <p className="text-xs text-muted-foreground">
                    Phone:{" "}
                    <span className="font-medium text-foreground">
                      {order.shippingAddress.phone || "N/A"}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground text-xs">
                  No shipping address recorded.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
