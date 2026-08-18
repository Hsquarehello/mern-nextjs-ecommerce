import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProductImageUrl(
  imageUrl: string | undefined | null,
): string {
  return imageUrl && imageUrl.trim() !== ""
    ? imageUrl.trim()
    : "/placeholder.png";
}
