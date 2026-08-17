import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProductImageUrl(
  images: string[] | string | undefined | null,
): string {
  const defaultPlaceholder = "/placeholder.png";

  if (!images) return defaultPlaceholder;

  // အကယ်၍ Array ဖြစ်နေပါက (ဥပမာ- ["url1", "url2"])
  if (Array.isArray(images) && images.length > 0) {
    const firstImage = images[0];
    if (typeof firstImage === "string" && firstImage.trim() !== "") {
      return firstImage.trim();
    }
  }

  // အကယ်၍ String ရိုးရိုး ဖြစ်နေပါက (ဥပမာ- "url1")
  if (typeof images === "string" && images.trim() !== "") {
    return images.trim();
  }

  return defaultPlaceholder;
}
