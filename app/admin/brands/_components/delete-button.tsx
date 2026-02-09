"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteBrand } from "@/actions/brand.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteBrandButton({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteBrand(id);
            toast.success("Brand deleted");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}
