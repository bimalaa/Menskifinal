"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/order.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("menski-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal > 50 ? subtotal : subtotal + 10;

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.images[0]?.url,
        price: item.price,
        product: item._id
      })),
      shippingAddress: {
        address: formData.get("address"),
        city: formData.get("city"),
        postalCode: formData.get("postalCode"),
        country: "USA" // Defaulting for now
      },
      paymentMethod: "COD",
      totalPrice: total,
      user: "64f0a9b2b5a2b1c3d4e5f6a1" // Placeholder: In real app, get from auth session
    };

    try {
      await createOrder(orderData);
      toast.success("Order placed successfully!");
      setStep(2);
      localStorage.removeItem("menski-cart");
    } catch (error: any) {
      toast.error("Failed to place order");
    }
  };

  if (step === 2) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <CheckCircle className="mx-auto h-24 w-24 text-primary" />
        <h1 className="text-5xl font-bold uppercase tracking-tighter">Mission Accomplished</h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto uppercase tracking-widest font-medium">
          Your order has been confirmed and is being prepped for dispatch.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="rounded-none px-12 py-6 uppercase tracking-widest font-bold"
        >
          Return to Base
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold uppercase tracking-tighter mb-12 text-center">Checkout</h1>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleComplete} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] border-b pb-2">Shipping Protocol</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">First Name</Label>
                  <Input name="firstName" required className="rounded-none border-2 bg-background" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Last Name</Label>
                  <Input name="lastName" required className="rounded-none border-2 bg-background" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Delivery Address</Label>
                <Input name="address" required className="rounded-none border-2 bg-background" placeholder="123 Command Way" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">City</Label>
                  <Input name="city" required className="rounded-none border-2 bg-background" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Postal Code</Label>
                  <Input name="postalCode" required className="rounded-none border-2 bg-background" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] border-b pb-2">Payment Credentials</h2>

            <div className="space-y-4 bg-muted/20 p-6 border-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Card Number</Label>
                <Input required placeholder="•••• •••• •••• ••••" className="rounded-none border-2 bg-background" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Expiry</Label>
                  <Input required placeholder="MM/YY" className="rounded-none border-2 bg-background" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">CVC</Label>
                  <Input required placeholder="•••" className="rounded-none border-2 bg-background" />
                </div>
              </div>

              <div className="pt-8">
                <Button type="submit" className="w-full rounded-none py-8 uppercase tracking-[0.2em] font-bold text-lg">
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
