import { getCategories } from "@/actions/category.actions";
import { getBrands } from "@/actions/brand.actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();
  const brands = await getBrands();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter">New Product</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">Define your new ritual essential</p>
      </div>

      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
