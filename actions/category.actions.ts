"use server";

import connectDB from "@/lib/db";
import Category from "@/models/category.models";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  await connectDB();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = name.toLowerCase().replace(/ /g, "-");

  await Category.create({ name, description, slug });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await connectDB();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = name.toLowerCase().replace(/ /g, "-");

  await Category.findByIdAndUpdate(id, { name, description, slug });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await connectDB();
  await Category.findByIdAndDelete(id);
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function getCategories() {
  await connectDB();
  return JSON.parse(JSON.stringify(await Category.find({})));
}
