import connectDB from "./lib/db";
import User from "./models/user.models";
import Order from "./models/order.models";

async function main() {
    await connectDB();
    console.log("Connected to DB");

    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`- ${u._id} (${u.email}) Role: ${u.role}`));

    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders:`);
    orders.forEach(o => console.log(`- Order ${o._id} belongs to User ${o.user}`));

    // Check matching
    for (const user of users) {
        const userOrders = await Order.find({ user: user._id });
        console.log(`User ${user.email} has ${userOrders.length} orders (via Mongoose query)`);
    }
}

main().catch(console.error).finally(() => process.exit());
