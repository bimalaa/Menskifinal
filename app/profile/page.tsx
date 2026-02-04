import { getOrdersByUser } from "@/actions/order.actions";
import { getAuthToken, verifyJWT } from "@/lib/auth";
import User from "@/models/user.models";
import connectDB from "@/lib/db";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function ProfilePage() {
    const token = await getAuthToken();
    if (!token) {
        redirect("/login");
    }

    const payload = await verifyJWT(token);
    if (!payload) {
        redirect("/login");
    }

    await connectDB();
    const user = await User.findById((payload as any).id);
    if (!user) {
        redirect("/login");
    }

    const orders = await getOrdersByUser(user._id);

    return (
        <div className="container py-10 space-y-10">
            <div>
                <h1 className="text-4xl font-bold uppercase tracking-tighter">My Profile</h1>
                <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">Manage your account and view orders</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="bg-muted/20 border-2 p-6 rounded-none space-y-4">
                        <h2 className="text-xl font-bold uppercase tracking-widest">Account Details</h2>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-bold block uppercase text-[10px] tracking-widest text-muted-foreground">Name</span>
                                <span className="font-medium text-lg">{user.name}</span>
                            </div>
                            <div>
                                <span className="font-bold block uppercase text-[10px] tracking-widest text-muted-foreground">Email</span>
                                <span className="font-medium text-lg">{user.email}</span>
                            </div>
                            <div>
                                <span className="font-bold block uppercase text-[10px] tracking-widest text-muted-foreground">Role</span>
                                <Badge variant={user.role === "admin" ? "destructive" : "secondary"} className="rounded-none uppercase tracking-widest font-bold">
                                    {user.role}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold uppercase tracking-widest">Order History</h2>

                    <div className="bg-background border-2 rounded-none">
                        <Table>
                            <TableHeader>
                                <TableRow className="uppercase tracking-widest text-[10px] font-bold">
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer Info</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground uppercase tracking-widest">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order: any) => (
                                        <TableRow key={order._id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">#{order._id.toString().slice(-6)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 block mb-0.5">Ship To</span>
                                                        <span className="text-xs font-bold uppercase tracking-tight">{order.firstName} {order.lastName}</span>
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground flex flex-col opacity-80">
                                                        <span>{order.email}</span>
                                                        <span>{order.phone}</span>
                                                    </div>
                                                    {order.userInfo && order.userInfo.name !== `${order.firstName} ${order.lastName}` && (
                                                        <div className="mt-1 pt-1 border-t border-dotted">
                                                            <span className="text-[8px] uppercase opacity-50 block">Ordered By</span>
                                                            <span className="text-[10px] font-medium">{order.userInfo.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs">{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                                            <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="rounded-none uppercase text-[10px] tracking-widest font-bold">
                                                    {order.paymentMethod}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant={order.isPaid ? "default" : "secondary"} className="w-fit rounded-none uppercase text-[10px] tracking-widest font-bold">
                                                        {order.isPaid ? "Paid" : "Unpaid"}
                                                    </Badge>
                                                    <Badge variant={order.isDelivered ? "default" : "secondary"} className="w-fit rounded-none uppercase text-[10px] tracking-widest font-bold">
                                                        {order.isDelivered ? "Delivered" : "Processing"}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {/* Placeholder for View Details if we implement individual order view later */}
                                                <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground">View</span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
