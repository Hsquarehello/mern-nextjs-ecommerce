"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Current Logged-in User ကို Backend မှ စစ်ဆေးရှာယူခြင်း
  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true, // HTTP-Only Cookie သုံးထားပါက ပါဝင်ရပါမည်
      });

      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Token သက်တမ်းကုန်နေခြင်း သို့မဟုတ် Login မဝင်ထားပါက User ကို null လုပ်မည်
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // App စတင်ချိန်တွင် Auth State ကို အလိုအလျောက် စစ်ဆေးခြင်း
  useEffect(() => {
    checkAuth();
  }, []);

  // Logout ပြုလုပ်ခြင်း
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("[LOGOUT_ERROR]", error);
    } finally {
      setUser(null);
      setLoading(false);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
