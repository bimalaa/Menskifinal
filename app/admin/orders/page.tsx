import connectDB from "@/lib/db";
import Order from "@/models/order.models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export default async function AdminOrdersPage() {
  await connectDB();
  // List ALL orders but label them, or filter by COD as requested.
  // The user requested: "also show orders of cash on delivery only"
  // Let's ensure the query works.
  const orders = await Order.find({
    paymentMethod: { $regex: /^COD$/i }
  }).populate("user", "name email").sort({ createdAt: -1 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter">COD Orders</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">Manage Cash on Delivery Transactions</p>
      </div>

      <div className="bg-background border-2 rounded-none">
        <Table>
          <TableHeader>
            <TableRow className="uppercase tracking-widest text-[10px] font-bold">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell className="font-mono text-xs">{order._id.toString().substring(0, 8)}...</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{order.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold">${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={order.isPaid ? "default" : "secondary"} className="rounded-none uppercase text-[10px]">
                    {order.isPaid ? "Paid" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${order._id}`}>
                    <Button variant="ghost" size="sm" className="uppercase text-[10px] font-bold tracking-widest">
                      <Eye className="h-3 w-3 mr-2" /> Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground uppercase tracking-widest">
                  No COD orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
