import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error & {
    statusCode?: number;
    code?: number;
    name: string;
    [key: string]: any;
  },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: any = null;

  // Debugging အတွက် Log မှတ်ခြင်း
  console.error(
    `[ERROR] ${new Date().toISOString()} - ${err.stack || err.message}`,
  );

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.flatten().fieldErrors;
  }

  // 2. Mongoose Cast Error (Invalid ObjectId -> 404 သို့ 400)
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found. Invalid ID: ${err.value}`;
  }

  // 3. Mongoose Duplicate Key Error (409 Conflict)
  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "Field";
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
  }

  // 4. Mongoose Validation Error
  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = "Database Validation Failed";
    errors = Object.values(err.errors).map((e: any) => e.message);
  }

  // 5. JWT Authentication Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Authorization denied.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  // Production မှာ 500 error မမျှော်လင့်ဘဲ ဖြစ်ရင် သာမန် Message ဖြင့်သာ တုံ့ပြန်ခြင်း
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal Server Error";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
