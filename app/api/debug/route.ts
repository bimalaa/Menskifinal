import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user.models";
import Order from "@/models/order.models";

export async function GET(request: Request) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const fix = searchParams.get("fix");

    const users = await User.find({});
    const orders = await Order.find({});

    let message = "Debug info only";

    if (fix === "true" && users.length > 0) {
        const targetUser = users[0]; // Assign to the first user (likely the admin created first)
        // Or prefer admin
        const admin = users.find(u => u.role === "admin") || users[0];

        await Order.updateMany({}, { $set: { user: admin._id } });
        message = `Updated ${orders.length} orders to belong to user ${admin.email} (${admin._id})`;
    }

    const updatedOrders = await Order.find({});

    const debugInfo = {
        message,
        userCount: users.length,
        users: users.map(u => ({ id: u._id, email: u.email, role: u.role })),
        orderCount: updatedOrders.length,
        orders: updatedOrders.map(o => ({ id: o._id, userId: o.user })),
    };

    return NextResponse.json(debugInfo);
}
