"use server";

import connectDB from "@/lib/db";
import Product from "@/models/products.models";
import Category from "@/models/category.models"; // Registration
import Brand from "@/models/brand.models"; // Registration
import { revalidatePath } from "next/cache";

export async function createProduct(data: any) {
  await connectDB();
  const product = await Product.create(data);
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  return JSON.parse(JSON.stringify(product));
}

export async function updateProduct(id: string, data: any) {
  await connectDB();
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/admin/products");
  revalidatePath(`/product/${id}`);
  revalidatePath("/");
  revalidatePath("/shop");
  return JSON.parse(JSON.stringify(product));
}

export async function deleteProduct(id: string) {
  await connectDB();
  await Product.findByIdAndDelete(id);
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  return { success: true };
}

import mongoose from "mongoose";

export async function getProducts(filters: any = {}) {
  await connectDB();
  const query: any = {};

  if (filters.category) {
    if (mongoose.Types.ObjectId.isValid(filters.category)) {
      query.category = filters.category;
    } else {
      const category = await Category.findOne({ slug: filters.category });
      if (category) {
        query.category = category._id;
      } else {
        // If category slug not found, return empty results
        return [];
      }
    }
  }

  if (filters.brand) {
    if (mongoose.Types.ObjectId.isValid(filters.brand)) {
      query.brand = filters.brand;
    } else {
      const brand = await Brand.findOne({ name: new RegExp(`^${filters.brand}$`, "i") });
      if (brand) {
        query.brand = brand._id;
      } else {
        return [];
      }
    }
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }

  const products = await Product.find(query).populate("category brand");
  return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id: string) {
  await connectDB();
  const product = await Product.findById(id).populate("category brand");
  return JSON.parse(JSON.stringify(product));
}

export async function getRecommendedProducts(productId: string) {
  await connectDB();
  const product = await Product.findById(productId);
  if (!product) return [];

  const recommended = await Product.find({
    _id: { $ne: productId },
    $or: [{ category: product.category }, { brand: product.brand }],
  })
    .limit(4)
    .populate("category brand");

  return JSON.parse(JSON.stringify(recommended));
}

export async function getFeaturedProducts() {
  await connectDB();
  const products = await Product.find({}).limit(8).populate("category brand");
  return JSON.parse(JSON.stringify(products));
}
