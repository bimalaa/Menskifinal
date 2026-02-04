"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product.actions";
import { uploadToCloudinary } from "@/actions/cloudinary.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface ProductFormProps {
    initialData?: any;
    categories: any[];
    brands: any[];
}

export default function ProductForm({ initialData, categories, brands }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<{ url: string; public_id: string }[]>(
        initialData?.images || []
    );

    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages = [...images];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                const base64Promise = new Promise<string>((resolve) => {
                    reader.onload = (event) => resolve(event.target?.result as string);
                    reader.readAsDataURL(file);
                });

                const base64 = await base64Promise;
                const res = await uploadToCloudinary(base64, "products");

                if (res.success && res.url && res.public_id) {
                    newImages.push({ url: res.url, public_id: res.public_id });
                } else {
                    toast.error(`Failed to upload ${file.name}`);
                }
            }
            setImages(newImages);
            toast.success("Images uploaded successfully");
        } catch (error) {
            toast.error("Upload process failed");
        } finally {
            setUploading(false);
        }
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            price: parseFloat(formData.get("price") as string),
            stock: parseInt(formData.get("stock") as string),
            category: formData.get("category"),
            brand: formData.get("brand"),
            images: images,
        };

        try {
            if (initialData) {
                await updateProduct(initialData._id, data);
                toast.success("Product updated successfully");
            } else {
                await createProduct(data);
                toast.success("Product created successfully");
            }
            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="bg-muted/20 border-2 p-8 space-y-8 rounded-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold">Product Name</Label>
                        <Input
                            name="name"
                            defaultValue={initialData?.name}
                            required
                            className="rounded-none bg-background border-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold">Description</Label>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description}
                            required
                            rows={5}
                            className="w-full rounded-none bg-background border-2 p-3 text-sm outline-none focus:border-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="uppercase tracking-widest text-[10px] font-bold">Price ($)</Label>
                            <Input
                                name="price"
                                defaultValue={initialData?.price}
                                type="number"
                                step="0.01"
                                required
                                className="rounded-none bg-background border-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="uppercase tracking-widest text-[10px] font-bold">Stock Quantity</Label>
                            <Input
                                name="stock"
                                defaultValue={initialData?.stock}
                                type="number"
                                required
                                className="rounded-none bg-background border-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold">Category</Label>
                        <select
                            name="category"
                            defaultValue={initialData?.category?._id || initialData?.category}
                            required
                            className="w-full rounded-none bg-background border-2 p-2 text-sm outline-none"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat: any) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] font-bold">Brand</Label>
                        <select
                            name="brand"
                            defaultValue={initialData?.brand?._id || initialData?.brand}
                            required
                            className="w-full rounded-none bg-background border-2 p-2 text-sm outline-none"
                        >
                            <option value="">Select Brand</option>
                            {brands.map((brand: any) => (
                                <option key={brand._id} value={brand._id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <Label className="uppercase tracking-widest text-[10px] font-bold">Product Images</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="aspect-square relative border-2 group">
                                    <Image src={img.url} alt="Preview" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-destructive text-white p-1 hidden group-hover:block"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed hover:border-primary cursor-pointer transition-colors relative">
                                {uploading ? (
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest mt-2">Upload</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-none uppercase tracking-widest font-bold"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" className="rounded-none uppercase tracking-widest font-bold px-12" disabled={loading}>
                    {loading ? (initialData ? "Updating..." : "Creating...") : initialData ? "Update Product" : "Save Product"}
                </Button>
            </div>
        </form>
    );
}
