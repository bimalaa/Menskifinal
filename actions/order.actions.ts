"use server";

import connectDB from "@/lib/db";
import Order from "@/models/order.models";
import Product from "@/models/products.models";
import { revalidatePath } from "next/cache";
import { getAuthToken, verifyJWT } from "@/lib/auth";

export async function createOrder(data: any) {
  await connectDB();

  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const payload = await verifyJWT(token);
  if (!payload || !(payload as any).id) {
    throw new Error("Invalid or expired session");
  }

  // Set user from token for security
  data.user = (payload as any).id;

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
  const mongoose = require("mongoose");

  const orders = await Order.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    {
      $unwind: {
        path: "$userInfo",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  return JSON.parse(JSON.stringify(orders));
}
