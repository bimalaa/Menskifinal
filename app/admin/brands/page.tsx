import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBrands } from "@/actions/brand.actions";
import Image from "next/image";
import BrandForm from "./_components/brand-form";
import DeleteBrandButton from "./_components/delete-button";

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Brands</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">Manage Laboratory Partners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <BrandForm />
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
                    <DeleteBrandButton id={brand._id} />
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
