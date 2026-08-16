"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/types";

// ၁။ Cart Item Interface သတ်မှတ်ခြင်း (Product + quantity)
export interface CartItem extends Product {
  quantity: number;
}

// ၂။ Context တွင် ပါဝင်မည့် State များနှင့် Function များ၏ Types သတ်မှတ်ခြင်း
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// ၃။ React Context ကို ဖန်တီးခြင်း
const CartContext = createContext<CartContextType | undefined>(undefined);

// ၄။ Provider Component တည်ဆောက်ခြင်း
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initial Load: LocalStorage မှ Cart Data ကို ပြန်လည်ယူဆောင်ခြင်း
  useEffect(() => {
    const savedCart = localStorage.getItem("shopping_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from LocalStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync: Cart State ပြောင်းလဲတိုင်း LocalStorage ထဲသို့ အလိုအလျောက် သိမ်းဆည်းခြင်း
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("shopping_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Cart ထဲသို့ ပစ္စည်းထည့်ခြင်း Logic
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        // ရှိပြီးသား ပစ္စည်းဖြစ်ပါက quantity ကို ၁ တိုးမည်
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // ပစ္စည်းအသစ်ဖြစ်ပါက quantity: 1 ဖြင့် ပေါင်းထည့်မည်
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Cart ထဲမှ ပစ္စည်းဖျက်ထုတ်ခြင်း Logic
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // ပစ္စည်း အရေအတွက် ပြင်ဆင်ခြင်း Logic
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // Cart တစ်ခုလုံးကို ရှင်းလင်းခြင်း Logic
  const clearCart = () => {
    setCart([]);
  };

  // စုစုပေါင်း အရေအတွက် တွက်ချက်ခြင်း
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // စုစုပေါင်း ကျသင့်ငွေ တွက်ချက်ခြင်း
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}>
      {children}
    </CartContext.Provider>
  );
};

// ၅။ Custom Hook ဖန်တီးခြင်း (Component များတွင် လွယ်ကူစွာ ခေါ်သုံးနိုင်ရန်)
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
