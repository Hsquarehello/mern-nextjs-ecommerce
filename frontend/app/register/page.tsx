"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { registerFormSchema, RegisterFormValues } from "@/lib/validations/auth";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");

      // Backend API သို့ ပေးပို့ခြင်း
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }, // Cookie (JWT) လက်ခံရရှိရန်
      );

      await checkAuth();
      // Register အောင်မြင်ပါက Home သို့မဟုတ် Dashboard သို့ လမ်းကြောင်းပြောင်းမည်
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("[REGISTER_ERROR]", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-md border">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your details below to create your account
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="John Doe"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-black hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
