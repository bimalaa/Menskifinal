"use server";

import connectDB from "@/lib/db";
import Brand from "@/models/brand.models";
import Product from "@/models/products.models";

export async function fixPlaceholderUrls() {
  await connectDB();

  // Update Brands
  const brands = await Brand.find({ logoUrl: /via\.placeholder\.com/ });
  for (const brand of brands) {
    brand.logoUrl = brand.logoUrl.replace("via.placeholder.com", "placehold.co");
    await brand.save();
  }

  // Update Products (though seed products use unsplash, manual ones might use placeholders)
  const products = await Product.find({ "images.url": /via\.placeholder\.com/ });
  for (const product of products) {
    product.images = product.images.map((img: any) => ({
      ...img,
      url: img.url.replace("via.placeholder.com", "placehold.co")
    }));
    await product.save();
  }

  return {
    success: true,
    brandsUpdated: brands.length,
    productsUpdated: products.length
  };
}
