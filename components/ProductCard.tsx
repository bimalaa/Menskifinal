"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <Card className="overflow-hidden border-none bg-muted/20 group hover:bg-muted/30 transition-all rounded-none">
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]?.url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="destructive" className="rounded-none uppercase text-[10px] font-bold">Out of Stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mb-1">
            {product.brand?.name}
          </p>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mb-1">
            {product.category?.name}
          </p>
          <h3 className="font-bold text-sm uppercase tracking-tight line-clamp-1">{product.name}</h3>
          <p className="mt-1 font-bold text-primary">${product.price.toFixed(2)}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={addToCart}
          variant="outline"
          className="w-full rounded-none uppercase text-[10px] font-bold tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
          disabled={product.stock <= 0}
        >
          {product.stock <= 0 ? "Unavailable" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
