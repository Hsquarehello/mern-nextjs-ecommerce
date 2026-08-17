import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import { User } from "./models/User.js";
import mongoose from "mongoose";

// Environment variables များကို ဖတ်ယူခြင်း (.env မှ MONGO_URI ရရှိရန်)
dotenv.config();

// MongoDB သို့ ချိတ်ဆက်ခြင်း
connectDB();
const sampleProducts = [
  {
    name: "Wireless Noise-Canceling Headphones",
    description:
      "High-quality sound with active noise cancellation and 30-hour battery life.",
    price: 199.99,
    category: "Electronics",
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    ],
    isFeatured: true,
  },
  {
    name: "Ergonomic Mechanical Keyboard",
    description:
      "RGB backlit mechanical keyboard with tactile switches for comfortable typing.",
    price: 89.99,
    category: "Electronics",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Ultra-Wide Curved Gaming Monitor",
    description:
      "34-inch 144Hz curved gaming monitor with HDR support and crisp resolution.",
    price: 499.99,
    category: "Electronics",
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    ],
    isFeatured: true,
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Track your daily steps, heart rate, sleep quality, and workouts with GPS integration.",
    price: 129.99,
    category: "Wearables",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Minimalist Leather Backpack",
    description:
      "Durable and stylish water-resistant leather backpack for daily use and travel.",
    price: 79.99,
    category: "Accessories",
    stock: 20,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
    isFeatured: false,
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof wireless speaker with deep bass and 12-hour continuous playtime.",
    price: 49.99,
    category: "Electronics",
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Precision Ergonomic Wireless Mouse",
    description:
      "Multi-device wireless mouse with customizable buttons and fast scrolling.",
    price: 59.99,
    category: "Electronics",
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Stainless Steel Smart Water Bottle",
    description:
      "Insulated water bottle that keeps drinks cold for 24 hours with UV self-cleaning.",
    price: 39.99,
    category: "Accessories",
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Noise-Isolating In-Ear Earbuds",
    description:
      "Compact wireless earbuds with crystal-clear audio and a pocket-sized charging case.",
    price: 79.99,
    category: "Electronics",
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    ],
    isFeatured: true,
  },
  {
    name: "4K Action Camera Waterproof",
    description:
      "Capture high-action moments in ultra 4K resolution with image stabilization.",
    price: 149.99,
    category: "Electronics",
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Foldable Laptop Stand Holder",
    description:
      "Aluminum adjustable laptop riser for better ergonomic posture and cooling.",
    price: 29.99,
    category: "Accessories",
    stock: 60,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Fast Wireless Charging Pad",
    description:
      "15W qi-certified fast wireless charger compatible with smartphones and earbuds.",
    price: 24.99,
    category: "Electronics",
    stock: 100,
    images: [
      "https://images.unsplash.com/photo-1622445268465-843dcb50303b?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Classic Aviator Sunglasses",
    description:
      "Polarized UV400 protection sunglasses with light titanium frame.",
    price: 45.0,
    category: "Accessories",
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Smart LED Desk Lamp",
    description:
      "Dimmable desk light with touch controls, multiple color modes, and USB charging port.",
    price: 34.99,
    category: "Electronics",
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Comfortable Ergonomic Gaming Chair",
    description:
      "High-back PU leather gaming chair with lumbar support and 360-degree swivel.",
    price: 249.99,
    category: "Furniture",
    stock: 10,
    images: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500",
    ],
    isFeatured: true,
  },
  {
    name: "HD USB Streaming Webcam",
    description:
      "1080p web camera with dual built-in microphones for video calls and live streaming.",
    price: 54.99,
    category: "Electronics",
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Durable Travel Duffel Bag",
    description:
      "Large capacity canvas weekend travel bag with separate shoe compartment.",
    price: 64.99,
    category: "Accessories",
    stock: 14,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
    isFeatured: false,
  },
  {
    name: "Compact External Solid State Drive (SSD) 1TB",
    description:
      "Ultra-fast portable SSD with read speeds up to 1050MB/s for fast file transfers.",
    price: 119.99,
    category: "Electronics",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
    ],
    isFeatured: true,
  },
  {
    name: "USB-C Multi-Port Hub Adapter",
    description:
      "7-in-1 adapter with 4K HDMI, 3 USB 3.0 ports, SD card reader, and 100W PD charging.",
    price: 35.99,
    category: "Electronics",
    stock: 55,
    images: [
      "https://images.unsplash.com/photo-1616440342232-017fb70ed422?w=500",
    ],
    isFeatured: false,
  },
  {
    name: "Aroma Essential Oil Diffuser",
    description:
      "Ultrasonic cool mist humidifier with 7 color LED changing lights for modern homes.",
    price: 27.99,
    category: "Home",
    stock: 32,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
    ],
    isFeatured: false,
  },
];
// Seed Function
const importData = async (): Promise<void> => {
  try {
    // ၁။ ရှေ့က ရှိပြီးသား ထုတ်ကုန် ဒေတာများကို ရှင်းလင်းပါ
    await Product.deleteMany();
    console.log("🗑️ Existing products cleared from database.");

    // ၂။ Dummy Products အသစ်များကို Database ထဲသို့ ထည့်သွင်းပါ
    await Product.insertMany(sampleProducts);
    console.log("✅ Sample products successfully seeded into MongoDB!");

    // ၃။ Process ကို အောင်မြင်စွာ ပိတ်ပါ
    process.exit(0);
  } catch (error: any) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

// Seed Script ကို စတင် Run ပါ
importData();

// const createInitialAdmin = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI as string);
//     console.log("[SEED] Connected to MongoDB...");

//     const adminEmail = "admin@example.com";
//     const existingAdmin = await User.findOne({ email: adminEmail });

//     if (existingAdmin) {
//       console.log("[SEED] Admin account already exists.");
//       process.exit(0);
//     }

//     await User.create({
//       name: "Super Admin",
//       email: adminEmail,
//       password: "adminpassword123", // Pre-save hook မှ အလိုအလျောက် Hash လုပ်သွားပါမည်
//       role: "admin",
//     });

//     console.log("[SEED] Initial Admin Account created successfully!");
//     process.exit(0);
//   } catch (error) {
//     console.error("[SEED] Error creating initial admin:", error);
//     process.exit(1);
//   }
// };

// createInitialAdmin();
