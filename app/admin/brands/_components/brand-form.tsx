"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import Image from "next/image";
import { createBrand } from "@/actions/brand.actions";
import { uploadToCloudinary } from "@/actions/cloudinary.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BrandForm() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [logoUrl, setLogoUrl] = useState("");
    const router = useRouter();

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onload = (event) => resolve(event.target?.result as string);
                reader.readAsDataURL(file);
            });

            const base64 = await base64Promise;
            const res = await uploadToCloudinary(base64, "brands");
            if (res.success && res.url) {
                setLogoUrl(res.url);
                toast.success("Logo uploaded");
            } else {
                toast.error("Logo upload failed");
            }
        } catch (error) {
            toast.error("Upload error");
        } finally {
            setUploading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        if (logoUrl) formData.set("logoUrl", logoUrl);

        try {
            await createBrand(formData);
            toast.success("Brand created");
            setLogoUrl("");
            form.reset();
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreate} className="bg-muted/20 border-2 p-6 space-y-4 rounded-none h-fit sticky top-24">
            <h3 className="font-bold uppercase tracking-widest text-sm mb-2">New Brand</h3>
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Brand Name</label>
                <input name="name" required className="w-full bg-background border-2 p-2 outline-none focus:border-primary rounded-none" />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Brand Logo</label>
                <div className="flex items-center gap-4">
                    {logoUrl ? (
                        <div className="h-12 w-24 relative border-2 group">
                            <Image src={logoUrl} alt="Logo Preview" fill className="object-contain" />
                            <button type="button" onClick={() => setLogoUrl("")} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ) : (
                        <label className="h-12 w-24 border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4 text-muted-foreground" />}
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" disabled={uploading} />
                        </label>
                    )}
                    <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground">PNG/JPG Preferred</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Description</label>
                <textarea name="description" rows={3} className="w-full bg-background border-2 p-2 outline-none focus:border-primary rounded-none" />
            </div>
            <Button type="submit" className="w-full rounded-none uppercase font-bold tracking-widest" disabled={loading || uploading}>
                {loading ? "Processing..." : "Add Brand"}
            </Button>
        </form>
    );
}
