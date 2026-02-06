import { getProductById, getRecommendedProducts } from "@/actions/product.actions";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { notFound } from "next/navigation";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const recommendations = await getRecommendedProducts(id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden bg-muted/20 border-2">
            <Image
              src={product.images[0]?.url || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: any, idx: number) => (
              <div key={idx} className="aspect-square relative border-2 hover:border-primary transition-colors cursor-pointer opacity-80 hover:opacity-100">
                <Image src={img.url} alt={`${product.name} ${idx}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{product.brand?.name}</p>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 py-2">
              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
              <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="rounded-none uppercase tracking-widest px-3">
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </Badge>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <AddToCartButton product={product} />
            <p className="text-xs text-center text-muted-foreground uppercase tracking-widest font-medium">Free domestic shipping on orders over $50</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t">
            <div className="text-center space-y-2">
              <ShieldCheck className="mx-auto h-6 w-6 text-primary" />
              <p className="text-[10px] uppercase font-bold tracking-widest leading-none">High Quality</p>
            </div>
            <div className="text-center space-y-2">
              <Truck className="mx-auto h-6 w-6 text-primary" />
              <p className="text-[10px] uppercase font-bold tracking-widest leading-none">Fast Shipping</p>
            </div>
            <div className="text-center space-y-2">
              <RotateCcw className="mx-auto h-6 w-6 text-primary" />
              <p className="text-[10px] uppercase font-bold tracking-widest leading-none">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="pt-20 border-t">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold uppercase tracking-tighter">Products you may like</h2>
            <p className="text-muted-foreground hidden md:block">Complement your daily regimen.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((rec: any) => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
