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
  images: string[];
  category: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

// 1. Base API Response Interface
export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | string[];
  stack?: string;
}

// 2. Pagination Metadata Interface
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 3. Paginated API Response Interface
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}
