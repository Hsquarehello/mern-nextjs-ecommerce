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
  let imageUrl = getProductImageUrl(product.imageUrl);
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

      <CardFooter className="mt-auto border-t border-border bg-muted/30 p-4">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Price
            </span>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2">
            <Button
              render={<Link href={`/products/${product._id}`} />}
              variant="outline"
              size="sm"
              className="w-full justify-center">
              View Details
            </Button>

            <Button
              onClick={() => addToCart(product)}
              size="sm"
              className="w-full justify-center bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">
              Add to Cart
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
