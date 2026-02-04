"use server";

import connectDB from "@/lib/db";
import Order from "@/models/order.models";
import Product from "@/models/products.models";
import { revalidatePath } from "next/cache";

export async function createOrder(data: any) {
  await connectDB();

  // Basic stock validation could go here

  const order = await Order.create(data);

  // Decrement stock
  for (const item of data.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  revalidatePath("/admin/orders");
  return JSON.parse(JSON.stringify(order));
}

export async function updateOrderStatus(id: string, isDelivered: boolean) {
  await connectDB();
  const order = await Order.findByIdAndUpdate(
    id,
    {
      isDelivered,
      deliveredAt: isDelivered ? new Date() : null,
    },
    { new: true }
  );
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return JSON.parse(JSON.stringify(order));
}

export async function getOrdersByUser(userId: string) {
  await connectDB();
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  console.log(orders);
  return JSON.parse(JSON.stringify(orders));
}
