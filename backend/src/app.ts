import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import productRoutes from "./routes/product.js";
import paymentRoutes from "./routes/payment.js";
import orderRoutes from "./routes/order.js";
import webhookRoutes from "./routes/webhook.js";

dotenv.config();

const app: Application = express();

app.use(cors());
// ⚠️ IMPORTANT: Webhook Route သည် Raw JSON Body လိုအပ်သဖြင့် express.json() ၏ အပေါ်တွင် ထားရှိရပါမည်
app.use("/api/webhook", webhookRoutes);
app.use(express.json());
app.use(morgan("dev"));

// Base API Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

export default app;
