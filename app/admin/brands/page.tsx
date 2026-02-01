"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Loader2, X, Edit } from "lucide-react";
import Image from "next/image";
import { getBrands, createBrand, deleteBrand, updateBrand } from "@/actions/brand.actions";
import { uploadToCloudinary } from "@/actions/cloudinary.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const router = useRouter();

  const fetchBrands = async () => {
    const data = await getBrands();
    setBrands(data);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

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
    const formData = new FormData(e.currentTarget);
    if (logoUrl) formData.set("logoUrl", logoUrl);

    try {
      await createBrand(formData);
      toast.success("Brand created");
      setLogoUrl("");
      e.currentTarget.reset();
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteBrand(id);
      toast.success("Brand deleted");
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Brands</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">Manage Laboratory Partners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
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
        </div>

        <div className="md:col-span-2 bg-background border-2 rounded-none h-fit">
          <Table>
            <TableHeader>
              <TableRow className="uppercase tracking-widest text-[10px] font-bold">
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand: any) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    {brand.logoUrl ? (
                      <div className="h-8 w-16 relative">
                        <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain" />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground uppercase tracking-widest text-[10px]">No Logo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-base uppercase tracking-tight leading-none mb-1">{brand.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold line-clamp-1 max-w-[200px]">
                        {brand.description || "No philosophy documented."}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(brand._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {brands.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-muted-foreground uppercase tracking-widest">No brands registered.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
