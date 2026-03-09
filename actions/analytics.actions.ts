"use server";

import connectDB from "@/lib/db";
import Order from "@/models/order.models";
import Product from "@/models/products.models";
import User from "@/models/user.models";
import { getAuthToken, verifyJWT } from "@/lib/auth";

export async function getDashboardStats() {
    await connectDB();

    // 1. Total Revenue (Sum of totalPrice for paid orders)
    // We assume isPaid: true is the condition for revenue.
    const totalRevenueResult = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // 2. Active Orders (isDelivered: false)
    // We assume active means not yet delivered.
    const activeOrders = await Order.countDocuments({ isDelivered: false });

    // 3. New Customers (Created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomers = await User.countDocuments({
        role: "user",
        createdAt: { $gte: thirtyDaysAgo }
    });

    // 4. Stock Alerts (stock < 5)
    // You can adjust the threshold as needed.
    const stockAlerts = await Product.countDocuments({ stock: { $lte: 5 } });

    // 5. Monthly Sales (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                sales: { $sum: "$totalPrice" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return {
        totalRevenue,
        activeOrders,
        newCustomers,
        stockAlerts,
        monthlySales
    };
}
