"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        // Redirect to home page on successful login
        await checkAuth();
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setServerError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto p-4">
      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full border p-2 rounded"
          placeholder="user@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full border p-2 rounded"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50">
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
