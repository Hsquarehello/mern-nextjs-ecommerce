import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  paymentIntentId: string;
  amount: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  customerEmail?: string;
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    paymentIntentId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    customerEmail: { type: String },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      phone: String,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product", // သင့် Product Model အမည်
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IOrder>("Order", OrderSchema);
