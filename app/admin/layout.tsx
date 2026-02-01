"use client";

import Link from "next/link";
import { LayoutDashboard, Package, Tag, Bookmark, ShoppingCart, LogOut } from "lucide-react";
import { logout } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-muted/20 p-6 hidden md:block">
        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Command Center</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/admin" className="flex items-center gap-3 text-sm font-medium p-2 hover:bg-muted transition-colors uppercase tracking-widest">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link href="/admin/products" className="flex items-center gap-3 text-sm font-medium p-2 hover:bg-muted transition-colors uppercase tracking-widest">
                <Package className="h-4 w-4" /> Products
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-3 text-sm font-medium p-2 hover:bg-muted transition-colors uppercase tracking-widest">
                <Tag className="h-4 w-4" /> Categories
              </Link>
              <Link href="/admin/brands" className="flex items-center gap-3 text-sm font-medium p-2 hover:bg-muted transition-colors uppercase tracking-widest">
                <Bookmark className="h-4 w-4" /> Brands
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-3 text-sm font-medium p-2 hover:bg-muted transition-colors uppercase tracking-widest">
                <ShoppingCart className="h-4 w-4" /> Orders
              </Link>
            </nav>
          </div>

          <div className="pt-8 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-sm font-bold p-2 text-destructive hover:bg-destructive/10 w-full transition-colors uppercase tracking-widest"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        {children}
      </main>
    </div>
  );
}
