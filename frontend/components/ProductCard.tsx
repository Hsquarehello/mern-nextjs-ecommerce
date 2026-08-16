"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between bg-white">
      <div>
        {/* Product Image */}
        <div className="w-full h-48 overflow-hidden rounded-lg mb-4 bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
        {/* Price display */}
        <div>
          <span className="text-xs text-gray-400 block">Price</span>
          <span className="text-xl font-extrabold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-4 py-2 rounded-lg transition-all text-sm shadow-sm">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
