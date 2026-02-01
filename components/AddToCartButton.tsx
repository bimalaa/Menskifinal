"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: any;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("menski-cart") || "[]");
    const existing = cart.find((item: any) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("menski-cart", JSON.stringify(cart));
    toast.success(`${product.name} added to bag`);
  };

  return (
    <Button
      size="lg"
      onClick={addToCart}
      className="flex-grow rounded-none py-8 uppercase tracking-widest font-bold text-lg"
      disabled={product.stock <= 0}
    >
      <ShoppingCart className="mr-2 h-6 w-6" /> Add to Cart
    </Button>
  );
}
