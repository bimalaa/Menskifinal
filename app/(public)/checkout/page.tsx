"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/order.actions";
import { getEsewaPaymentParams } from "@/actions/esewa.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // Calculate subtotal in USD first
    const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalUSD = subtotalUSD > 50 ? subtotalUSD : subtotalUSD + 10;

    // Convert to NPR
    const totalNPR = Math.round(totalUSD);

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.images[0]?.url,
        price: Math.round(item.price), // Convert item price to NPR
        product: item._id
      })),
      shippingAddress: {
        address: formData.get("address"),
        city: formData.get("city"),
        postalCode: formData.get("postalCode"),
        country: "Nepal"
      },
      paymentMethod: "eSewa",
      totalPrice: totalNPR, // Save total in NPR
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    try {
      // 1. Create Order in DB
      const order = await createOrder(orderData);

      // 2. Get eSewa Signature & Params
      const paymentParams = await getEsewaPaymentParams(order._id, totalNPR);

      // 3. Submit Hidden Form to eSewa
      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");
      form.target = "_self";

      for (const [key, value] of Object.entries(paymentParams)) {
        const hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", String(value));
        form.appendChild(hiddenField);
      }

      document.body.appendChild(form);
      form.submit();

    } catch (error: any) {
      console.error(error);
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Email Address</Label>
                  <Input name="email" type="email" required className="rounded-none border-2 bg-background" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Phone Number</Label>
                  <Input name="phone" type="tel" required className="rounded-none border-2 bg-background" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Delivery Address</Label>
                <Input name="address" required className="rounded-none border-2 bg-background" placeholder="Street Address" />
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
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] border-b pb-2">Payment Method</h2>

            <div className="space-y-6 bg-muted/20 p-8 border-2 flex flex-col items-center text-center">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Secure Payment via</p>
                <div className="bg-[#60bb46] text-white font-bold text-3xl px-6 py-2 rounded-sm tracking-tighter">eSewa</div>
              </div>

              <p className="text-xs text-muted-foreground uppercase tracking-wider leading-relaxed max-w-xs">
                You will be redirected to the eSewa secure payment portal to complete your transaction.
              </p>

              <div className="w-full pt-4">
                <Button type="submit" className="w-full rounded-none py-8 uppercase tracking-[0.2em] font-bold text-lg" disabled={loading}>
                  {loading ? "Initiating..." : "Pay with eSewa"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
