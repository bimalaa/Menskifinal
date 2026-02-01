"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth.actions";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
            MENSKI<span className="text-primary">.</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
              Shop All
            </Link>
            <Link href="/shop?category=face-care" className="text-sm font-medium hover:text-primary transition-colors">
              Face Care
            </Link>
            <Link href="/shop?category=beard-care" className="text-sm font-medium hover:text-primary transition-colors">
              Beard Care
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 flex flex-col gap-4 bg-background">
          <Link href="/shop" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
          <Link href="/shop?category=face-care" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Face Care</Link>
          <Link href="/shop?category=beard-care" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Beard Care</Link>
        </div>
      )}
    </nav>
  );
}
