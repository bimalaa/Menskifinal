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
  const orders = await Order.aggregate([
    {
      $match: {
        paymentMethod: { $regex: /^COD$/i }
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
                  <div className="flex flex-col group">
                    <span className="font-extrabold text-sm uppercase tracking-tight">{order.firstName} {order.lastName}</span>
                    <span className="text-xs font-medium text-muted-foreground">{order.email}</span>
                    <span className="text-[10px] text-muted-foreground/60">{order.phone}</span>

                    {order.userInfo && (
                      <div className="mt-2 pt-2 border-t border-dashed border-primary/20">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80">Linked Account</span>
                        </div>
                        <p className="text-[10px] font-bold mt-0.5">{order.userInfo.name}</p>
                        <p className="text-[9px] opacity-60 lowercase">{order.userInfo.email}</p>
                      </div>
                    )}
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
