import { getProducts } from "@/actions/product.actions";
import { getCategories as fetchCategories } from "@/actions/category.actions";
import { getBrands as fetchBrands } from "@/actions/brand.actions";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const products = await getProducts({
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
  });

  const categories = await fetchCategories();
  const brands = await fetchBrands();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="font-bold uppercase tracking-widest text-sm mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className={`text-sm hover:text-primary transition-colors ${!params.category ? "font-bold text-primary" : "text-muted-foreground"}`}
                >
                  All Products
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat._id}>
                  <Link
                    href={`/shop?category=${cat._id}`}
                    className={`text-sm hover:text-primary transition-colors ${params.category === cat._id ? "font-bold text-primary" : "text-muted-foreground"}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-widest text-sm mb-4">Brands</h3>
            <ul className="space-y-2">
              {brands.map((brand: any) => (
                <li key={brand._id}>
                  <Link
                    href={`/shop?brand=${brand._id}`}
                    className={`text-sm hover:text-primary transition-colors ${params.brand === brand._id ? "font-bold text-primary" : "text-muted-foreground"}`}
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-grow">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-tighter">
              {params.category ? "Category Results" : "All Products"}
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">
              {products.length} Items Found
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed rounded-none">
              <p className="text-muted-foreground uppercase tracking-widest italic">No products matched your criteria.</p>
              <Link href="/shop">
                <button className="mt-4 text-xs font-bold uppercase tracking-widest underline underline-offset-4">Clear All Filters</button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
