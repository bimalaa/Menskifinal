import { getProducts } from "@/actions/product.actions";
import Category from "@/models/category.models"; // Registration
import Brand from "@/models/brand.models"; // Registration
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProductActions from "@/components/admin/ProductActions";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter">Inventory</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">Manage Your Product Catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="rounded-none uppercase tracking-widest font-bold px-8">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-background border-2 rounded-none">
        <Table>
          <TableHeader>
            <TableRow className="uppercase tracking-widest text-[10px] font-bold">
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product._id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="h-12 w-12 relative border">
                    <Image
                      src={product.images[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="uppercase text-[10px] font-bold tracking-widest">{product.brand?.name}</TableCell>
                <TableCell className="uppercase text-[10px] font-bold tracking-widest">{product.category?.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={product.stock < 10 ? "text-destructive font-bold" : ""}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground uppercase tracking-widest">
                  No products found in the database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
