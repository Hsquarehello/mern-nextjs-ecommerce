import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // တခြား External Domain များပါ သုံးချင်ပါက ဒီမှာ ထပ်တိုးနိုင်ပါတယ်
      // {
      //   protocol: "https",
      //   hostname: "res.cloudinary.com",
      // },
    ],
  },
};

export default nextConfig;
