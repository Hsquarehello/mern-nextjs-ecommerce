import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface IOrder extends Document {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail?: string;
  items: IOrderItem[];
  createdAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    paymentIntentId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: { type: String, required: true },
    customerEmail: { type: String },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);