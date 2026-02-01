import connectDB from "@/lib/db";
import Order from "@/models/order.models";
import Product from "@/models/products.models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, User as UserIcon, MapPin, Truck, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import OrderStatusToggle from "@/components/admin/OrderStatusToggle";
interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;
  await connectDB();

  const order = await Order.findById(id)
    .populate("user", "name email")
    .populate("orderItems.product");

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon" className="rounded-none border-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter">Order Details</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">#{order._id.toString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-background border-2 rounded-none overflow-hidden">
            <div className="bg-muted/30 p-4 border-b">
              <h3 className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm">
                <Package className="h-4 w-4" /> Items Ordered
              </h3>
            </div>
            <div className="divide-y-2">
              {order.orderItems.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 items-center">
                  <div className="h-16 w-16 relative border flex-shrink-0">
                    <Image
                      src={item.product?.images[0]?.url || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm uppercase tracking-tight">{item.name}</h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">${item.price.toFixed(2)} / each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-muted/10 p-4 border-t-2 space-y-2">
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                <span>Total Amount</span>
                <span className="text-lg">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background border-2 rounded-none p-6 space-y-4">
              <h3 className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm border-b pb-4">
                <UserIcon className="h-4 w-4" /> Customer
              </h3>
              <div>
                <p className="font-bold text-lg uppercase tracking-tight">{order.user?.name}</p>
                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
              </div>
            </div>

            <div className="bg-background border-2 rounded-none p-6 space-y-4">
              <h3 className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm border-b pb-4">
                <MapPin className="h-4 w-4" /> Shipping
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-bold uppercase tracking-widest">{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Status Management */}
        <div className="space-y-8">
          <div className="bg-background border-2 rounded-none p-6 space-y-6">
            <h3 className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm border-b pb-4">
              <Truck className="h-4 w-4" /> Fulfillment
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-muted/20 p-4 border text-xs">
                <span className="uppercase font-bold tracking-widest opacity-70">Payment Method</span>
                <Badge className="rounded-none uppercase tracking-widest font-black">{order.paymentMethod}</Badge>
              </div>

              <div className="flex justify-between items-center bg-muted/20 p-4 border text-xs">
                <span className="uppercase font-bold tracking-widest opacity-70">Payment Status</span>
                <Badge variant={order.isPaid ? "default" : "destructive"} className="rounded-none uppercase tracking-widest">
                  {order.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  {order.isDelivered ? (
                    <CheckCircle className="h-8 w-8 text-primary" />
                  ) : (
                    <Clock className="h-8 w-8 text-muted-foreground animate-pulse" />
                  )}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">Delivery Status</p>
                    <p className="text-sm font-black uppercase tracking-tighter">
                      {order.isDelivered ? "Delivered" : "In Transit / Pending"}
                    </p>
                    {order.deliveredAt && (
                      <p className="text-[10px] text-muted-foreground">{new Date(order.deliveredAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <OrderStatusToggle orderId={order._id.toString()} isDelivered={order.isDelivered} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
