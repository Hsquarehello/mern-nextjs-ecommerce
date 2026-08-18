import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import mongoose from "mongoose";

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Noise-Canceling Headphones",
    description:
      "High-quality sound with active noise cancellation and 30-hour battery life.",
    price: 199.99,
    category: "Electronics",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", // 👈 imageUrl ဖြည့်ထားသည်
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
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
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
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
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
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
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
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
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
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
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
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
    ],
    isFeatured: false,
  },
];

const sampleOrders = [
  {
    paymentIntentId: "pi_3Mtwp2Lkd34X1201A",
    customerEmail: "aung.aung@example.com",
    amount: 199.99,
    currency: "usd",
    paymentStatus: "paid",
    orderStatus: "Delivered",
    shippingAddress: {
      fullName: "Aung Aung",
      address: "No. 123, Pyay Road",
      city: "Yangon",
      postalCode: "11181",
      phone: "09123456789",
    },
    items: [
      {
        name: "Wireless Noise-Canceling Headphones",
        price: 199.99,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      },
    ],
  },
  {
    paymentIntentId: "pi_3Mtwp2Lkd34X1202B",
    customerEmail: "kyaw.kyaw@example.com",
    amount: 179.50,
    currency: "usd",
    paymentStatus: "paid",
    orderStatus: "Shipped",
    shippingAddress: {
      fullName: "Kyaw Kyaw",
      address: "No. 45, Bogyoke Street",
      city: "Mandalay",
      postalCode: "05011",
      phone: "09987654321",
    },
    items: [
      {
        name: "Ergonomic Mechanical Keyboard",
        price: 129.50,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      },
      {
        name: "Wireless Optical Mouse",
        price: 25.00,
        quantity: 2,
        imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
      },
    ],
  },
];

const seedData = async (): Promise<void> => {
  try {
    await connectDB();
    console.log("Connected to MongoDB...");

    // 1. Products များကို Seed ပြုလုပ်ခြင်း
    await Product.deleteMany();
    console.log("🗑️ Existing products cleared.");
    await Product.insertMany(sampleProducts);
    console.log("✅ Sample products seeded successfully!");

    // 2. Orders များကို Seed ပြုလုပ်ခြင်း
    await Order.deleteMany();
    console.log("🗑️ Existing orders cleared.");
    await Order.insertMany(sampleOrders);
    console.log("✅ Sample orders seeded successfully!");

    process.exit(0);
  } catch (error: any) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

seedData();