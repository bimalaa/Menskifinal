import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
            MENSKI<span className="text-primary">.</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Premium skincare formulated specifically for the modern man.
            Simplicity meets effectiveness.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop" className="hover:text-primary">All Products</Link></li>
            <li><Link href="/shop?category=face-care" className="hover:text-primary">Face Care</Link></li>
            <li><Link href="/shop?category=beard-care" className="hover:text-primary">Beard Care</Link></li>
            <li><Link href="/shop?category=hair-care" className="hover:text-primary">Hair Care</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/shipping" className="hover:text-primary">Shipping & Returns</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">Join the Club</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe for exclusive offers and skincare tips.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-background border px-3 py-2 text-sm w-full outline-none focus:border-primary"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">Join</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} MENSKI SKINCARE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
