import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import productRoutes from "./routes/product.js";
import paymentRoutes from "./routes/payment.js";
import orderRoutes from "./routes/order.js";
import authRoutes from "./routes/auth.js";
import webhookRoutes from "./routes/webhook.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import { AppError } from "./utils/appError.js";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Frontend ရဲ့ URL
    credentials: true, // Cookies ပေးပို့ခွင့် ပြုရ
  }),
);
// ⚠️ IMPORTANT: Webhook Route သည် Raw JSON Body လိုအပ်သဖြင့် express.json() ၏ အပေါ်တွင် ထားရှိရပါမည်
app.use("/api/webhook", webhookRoutes);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Base API Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// 404 Route (မရှိသော Route များကို ဖမ်းရန်)
app.use((req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ⚠️ Global Error Handler သည် အောက်ဆုံးတွင် ရှိရပါမည်
app.use(errorHandler);

export default app;
