import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/actions/product.actions";
import ProductCard from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center space-y-6">
          <Badge className="bg-primary text-primary-foreground mb-4 uppercase tracking-[0.2em] rounded-none">New Collection</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase max-w-4xl mx-auto leading-none">
            Grooming Excellence <br /> for the Modern Man
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scientifically engineered skincare designed to work with a man's unique skin chemistry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/shop">
              <Button size="lg" className="rounded-none px-12 uppercase tracking-widest text-xs font-bold">
                Shop the Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="rounded-none px-12 uppercase tracking-widest text-xs font-bold">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Face Care", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000", slug: "face-care" },
            { name: "Beard Care", image: "https://images.unsplash.com/photo-1590159763121-7c9fd312190d?q=80&w=1000", slug: "beard-care" },
            { name: "Body Care", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000", slug: "body-care" }
          ].map((cat) => (
            <Link key={cat.name} href={`/shop?category=${cat.slug}`} className="group relative h-[400px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-bold uppercase tracking-tighter text-white">{cat.name}</h3>
                <div className="flex items-center gap-2 text-white/80 text-sm mt-1 uppercase tracking-widest font-bold">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold uppercase tracking-tighter">Essential Rituals</h2>
            <p className="text-muted-foreground">The foundation of a better regimen.</p>
          </div>
          <Link href="/shop" className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-full py-20 text-muted-foreground uppercase tracking-widest">No products found. Seeding required.</p>
          )}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="h-5 w-5 text-primary fill-primary" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium tracking-tight italic text-muted-foreground">
            "The results were immediate. My skin felt hydrated without the greasy feel of common products. MENSKI is the real deal."
          </blockquote>
          <p className="mt-6 font-bold uppercase tracking-widest text-sm">— James R., Professional Grooming Specialist</p>
        </div>
      </section>
    </div>
  );
}

// Badge helper since I'm implementing it here for the hero
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${className}`}>
      {children}
    </span>
  );
}
