import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { User } from "../models/User.js";

interface JwtPayload {
  id: string;
}

// Express Request ထဲတွင် user property ထည့်သွင်းနိုင်ရန် Extend ပြုလုပ်ခြင်း
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token: string | undefined;

  // 1. Cookie ထဲမှ token ကို အရင် စစ်ယူမည်
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Cookie မရှိပါက Authorization Header (Bearer token) ကို စစ်မည်
  else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Token နှစ်ခုလုံး မရှိပါက Guest အနေဖြင့် ရှေ့ဆက်မည်
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      (req as any).user = user;
    }
  } catch (error) {
    console.error("Optional auth token invalid:", error);
  }

  next();
};

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Authentication required. Please log in.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    return next(new AppError("Access denied. Admin privileges required.", 403));
  }
  next();
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    // Cookie သို့မဟုတ် Authorization Header ထဲမှ Token ကို ယူခြင်း
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(
          "You are not logged in. Please log in to get access.",
          401,
        ),
      );
    }

    // Token ကို Verify ပြုလုပ်ခြင်း
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    // Database ထဲတွင် User ရှိမရှိ ပြန်စစ်ခြင်း
    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401),
      );
    }

    // Request Object ထဲတွင် user ထည့်ပေးလိုက်ခြင်း
    req.user = currentUser;
    next();
  } catch (error) {
    return next(
      new AppError("Invalid or expired token. Please log in again.", 401),
    );
  }
};
