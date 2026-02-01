"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/product.actions";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await deleteProduct(productId);
      if (res.success) {
        toast.success("Product deleted successfully");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/admin/products/${productId}/edit`}>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
