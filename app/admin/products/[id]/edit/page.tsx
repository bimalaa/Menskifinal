import { getProductById } from "@/actions/product.actions";
import { getCategories } from "@/actions/category.actions";
import { getBrands } from "@/actions/brand.actions";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const categories = await getCategories();
  const brands = await getBrands();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Edit Product</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">Update existing product details</p>
      </div>

      <ProductForm initialData={product} categories={categories} brands={brands} />
    </div>
  );
}
