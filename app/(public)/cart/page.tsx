"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("menski-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item._id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("menski-cart", JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    localStorage.setItem("menski-cart", JSON.stringify(updated));
  };

  if (!mounted) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold uppercase tracking-tighter mb-12">Your Regimen Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item._id} className="flex gap-6 pb-6 border-b">
                <div className="h-32 w-32 relative border-2 flex-shrink-0">
                  <Image src={item.images[0]?.url} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-primary">{item.brand?.name}</p>
                      <h3 className="font-bold text-lg uppercase tracking-tight">{item.name}</h3>
                    </div>
                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border-2 px-2">
                      <Button variant="ghost" size="icon" onClick={() => updateQuantity(item._id, -1)} className="h-8 w-8 hover:bg-transparent">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <Button variant="ghost" size="icon" onClick={() => updateQuantity(item._id, 1)} className="h-8 w-8 hover:bg-transparent">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item._id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 uppercase text-[10px] font-bold tracking-widest">
                      <Trash2 className="h-3 w-3 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed space-y-4">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground uppercase tracking-widest font-medium">Your bag is currently empty.</p>
              <Link href="/shop">
                <Button variant="outline" className="rounded-none uppercase tracking-widest font-bold">Start Browsing</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="bg-muted/20 border-2 p-8 h-fit space-y-8 rounded-none">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b pb-4">Order Summary</h2>
          <div className="space-y-4 text-sm font-medium uppercase tracking-widest">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{subtotal > 50 ? "FREE" : "$10.00"}</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold uppercase tracking-tight border-t pt-4">
            <span>Total</span>
            <span>${(subtotal > 50 ? subtotal : subtotal + 10).toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="block w-full">
            <Button className="w-full rounded-none py-8 uppercase tracking-[0.2em] font-bold text-lg" disabled={cartItems.length === 0}>
              Proceed to Checkout
            </Button>
          </Link>
          <p className="text-[10px] text-center text-muted-foreground font-bold tracking-[0.1em] uppercase">
            Secure checkout powered by MENSKI Advanced Systems
          </p>
        </div>
      </div>
    </div>
  );
}
