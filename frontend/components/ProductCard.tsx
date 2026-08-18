"use client";

import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getProductImageUrl } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Image URL ရယူခြင်း (Type Guard သေချာ ထည့်ထားပါသည်)
  let imageUrl = getProductImageUrl(product.images);
  return (
    <Card className="flex flex-col justify-between overflow-hidden hover:shadow-lg transition-shadow">
      <div>
        {/* Product Image */}
        <div className="w-full h-48 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
        </CardContent>
      </div>

      <CardFooter className="mt-4 border-t border-border p-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Price
            </span>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              render={<Link href={`/products/${product._id}`} />}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none">
              View Details
            </Button>

            <Button
              onClick={() => addToCart(product)}
              size="sm"
              className="flex-1 bg-slate-900 text-white hover:bg-slate-800 sm:flex-none">
              Add to Cart
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
