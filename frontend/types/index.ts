// Cart တွင်းရှိ ပစ္စည်းတစ်ခုချင်းစီ၏ Type သတ်မှတ်ချက်
export interface CartItem {
  id: string;
  name: string;
  price: number; // USD
  quantity: number;
}

// Backend Payment Intent API ၏ Response Type သတ်မှတ်ချက်
export interface PaymentIntentResponse {
  clientSecret: string;
}

// MongoDB မှ ပြန်လာမည့် Product Data Format
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}
