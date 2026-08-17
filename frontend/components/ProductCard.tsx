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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Image URL ရယူခြင်း (Type Guard သေချာ ထည့်ထားပါသည်)
  let imageUrl = "/placeholder.png";

  if (Array.isArray(product.images) && product.images.length > 0) {
    if (
      typeof product.images[0] === "string" &&
      product.images[0].trim() !== ""
    ) {
      imageUrl = product.images[0];
    }
  } else if (
    typeof product.images === "string" &&
    (product.images as string).trim() !== ""
  ) {
    imageUrl = product.images;
  }

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

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border mt-4">
        <div>
          <span className="text-xs text-muted-foreground block">Price</span>
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <Button onClick={() => addToCart(product)} size="sm">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
