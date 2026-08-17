export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // ES5 သို့ ပြောင်းသည့်အခါ prototype Chain မပျက်စေရန် Fix လုပ်ခြင်း
    Object.setPrototypeOf(this, new.target.prototype);

    // Stack trace ထဲမှ constructor ကို ဖယ်ထုတ်ခြင်း
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
