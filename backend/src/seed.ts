import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';

// Environment variables များကို ဖတ်ယူခြင်း (.env မှ MONGO_URI ရရှိရန်)
dotenv.config();

// MongoDB သို့ ချိတ်ဆက်ခြင်း
connectDB();

// စမ်းသပ်ရန် Dummy Products အချက်အလက်များ
const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'High-quality sound with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 25,
  },
  {
    name: 'Ergonomic Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile switches for comfortable typing.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    stock: 15,
  },
  {
    name: 'Ultra-Wide Curved Gaming Monitor',
    description: '34-inch 144Hz curved gaming monitor with HDR support and crisp resolution.',
    price: 499.99,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    stock: 8,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your daily steps, heart rate, sleep quality, and workouts with GPS integration.',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stock: 40,
  },
  {
    name: 'Minimalist Leather Backpack',
    description: 'Durable and stylish water-resistant leather backpack for daily use and travel.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    stock: 20,
  },
];

// Seed Function
const importData = async (): Promise<void> => {
  try {
    // ၁။ ရှေ့က ရှိပြီးသား ထုတ်ကုန် ဒေတာများကို ရှင်းလင်းပါ
    await Product.deleteMany();
    console.log('🗑️ Existing products cleared from database.');

    // ၂။ Dummy Products အသစ်များကို Database ထဲသို့ ထည့်သွင်းပါ
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products successfully seeded into MongoDB!');

    // ၃။ Process ကို အောင်မြင်စွာ ပိတ်ပါ
    process.exit(0);
  } catch (error: any) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

// Seed Script ကို စတင် Run ပါ
importData();