"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/actions/order.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OrderStatusToggle({ orderId, isDelivered }: { orderId: string, isDelivered: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await updateOrderStatus(orderId, !isDelivered);
      toast.success(`Order marked as ${!isDelivered ? "delivered" : "pending"}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant={isDelivered ? "outline" : "default"}
      className="w-full rounded-none uppercase font-bold tracking-widest"
    >
      {loading ? "Updating..." : (isDelivered ? "Mark as Pending" : "Mark as Delivered")}
    </Button>
  );
}
