import type { Request, Response } from "express";
import Order from "../models/Order.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { items, amount, paymentIntentId, customerEmail, shippingAddress } =
      req.body;

    console.log(req.user);
    if (!items || items.length === 0) {
      throw new AppError("No items in order", 400);
    }

    const order = new Order({
      user: req.user?._id, // Auth middleware မှ ပါလာသော User ID (ရှိလျှင်)
      items,
      amount,
      paymentIntentId,
      customerEmail,
      shippingAddress,
      paymentStatus: "paid",
      orderStatus: "Processing",
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  },
);

// 2. [ADMIN] Order အားလုံးကို ဆွဲထုတ်ခြင်း
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const status = req.query.status as string; // ဥပမာ - Processing, Shipped, Delivered, Cancelled
    const search = req.query.search as string;

    const query: any = {};

    if (status && status.toLocaleLowerCase() !== "all") {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { customerEmail: { $regex: search, $options: "i" } },
        { paymentIntentId: { $regex: search, $options: "i" } },
      ];
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  },
);

// 3. [ADMIN] Order တစ်ခု၏ အသေးစိတ် ကြည့်ခြင်း
export const getOrderById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      throw new AppError("Order not found", 404);
    }
    res.status(200).json(order);
  },
);

// 4. [ADMIN] Order Status Update လုပ်ခြင်း (ဥပမာ - Processing မှ Shipped သို့)
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  },
);

// 2. [CUSTOMER] Get logged-in user's order history with pagination
export const getMyOrders = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?._id) {
      throw new AppError("User not authenticated", 401);
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    const [orders, totalOrders] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  },
);

// [CUSTOMER] Get single order details for logged-in user
export const getMyOrderById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // 1. req.params ထဲမှ id ကို ဆွဲထုတ်ပါသည်
    const { id } = req.params;

    // 2. User Authentication ရှိမရှိ စစ်ဆေးပါသည်
    if (!req.user?._id) {
      throw new AppError("User not authenticated", 401);
    }

    // 3. id သည် string သီးသန့် ဟုတ်မဟုတ်နှင့် undefined မဟုတ်ကြောင်း စစ်ဆေးပါသည်
    // ဤသို့ စစ်ဆေးလိုက်ခြင်းဖြင့် TypeScript Error ကို ပြေလည်စေပါသည်။
    if (!id || typeof id !== "string") {
      throw new AppError("Invalid or missing order ID", 400);
    }

    // 4. Mongoose Query သို့ ပို့ဆောင်ပါသည် (id မှာ string ဖြစ်ကြောင်း သေချာသွားပြီ ဖြစ်သည်)
    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    });

    // 5. Order မရှိပါက Error ပြပါသည်
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // 6. Order Detail ကို Response အဖြစ် ပြန်ပေးပါသည်
    res.status(200).json(order);
  },
);
