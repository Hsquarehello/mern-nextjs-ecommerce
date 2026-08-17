import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { RegisterSchema, LoginSchema } from "../validations/auth.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

// JWT Token Helper Function
const generateToken = (res: Response, userId: string, role: string) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "default_secret_key",
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// 1. Register User
export const register = asyncHandler(async (req: Request, res: Response) => {
  // Zod Validation Parse (Strict parsing)
  const validationResult = RegisterSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new AppError("Validation Error", 400); // errorHandler မှ Zod Error ကို ထပ်မံ ဖမ်းယူပေးမည်
  }

  const { name, email, password, role, adminSecretKey } = validationResult.data;

  // Check Existing User
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered", 400);
  }

  let assignedRole: "user" | "admin" = "user";

  if (role === "admin") {
    if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      throw new AppError(
        "Invalid Admin Secret Key. Authorization denied.",
        403,
      );
    }
    assignedRole = "admin";
  }

  // Create User
  const user = await User.create({ name, email, password, role: assignedRole });

  generateToken(res, user._id.toString(), user.role);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 2. Login User
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = LoginSchema.parse(req.body); // Direct parse with Zod

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  generateToken(res, user._id.toString(), user.role);

  return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 3. Logout User
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // protect middleware က req.user ထဲတွင် user detail ထည့်ပေးထားပြီးဖြစ်သည်
  if (!req.user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
