import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve သုံးခြင်းဖြင့် sync/async နှစ်မျိုးလုံးကို စိတ်ချစွာ ဖမ်းယူနိုင်ပါသည်
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
