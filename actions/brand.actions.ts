"use server";

import connectDB from "@/lib/db";
import Brand from "@/models/brand.models";
import { revalidatePath } from "next/cache";

export async function createBrand(formData: FormData) {
  await connectDB();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const logoPublicId = formData.get("logoPublicId") as string;

  await Brand.create({ name, description, logoUrl, logoPublicId });
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function updateBrand(id: string, formData: FormData) {
  await connectDB();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const logoPublicId = formData.get("logoPublicId") as string;

  await Brand.findByIdAndUpdate(id, { name, description, logoUrl, logoPublicId });
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function deleteBrand(id: string) {
  await connectDB();
  await Brand.findByIdAndDelete(id);
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function getBrands() {
  await connectDB();
  return JSON.parse(JSON.stringify(await Brand.find({})));
}
