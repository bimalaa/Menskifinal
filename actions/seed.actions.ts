"use server";

import connectDB from "@/lib/db";
import Category from "@/models/category.models";
import Brand from "@/models/brand.models";
import Product from "@/models/products.models";

export async function seedDatabase() {
  await connectDB();

  // 1. Clear existing data
  await Category.deleteMany({});
  await Brand.deleteMany({});
  await Product.deleteMany({});

  // 2. Create Categories
  const categories = await Category.insertMany([
    { name: "Face Care", description: "Daily essentials for facial grooming", slug: "face-care" },
    { name: "Beard Care", description: "Master your beard and mustache", slug: "beard-care" },
    { name: "Hair Care", description: "High-performance hair solutions", slug: "hair-care" },
    { name: "Body Care", description: "Total body preservation", slug: "body-care" },
  ]);

  // 3. Create Brands
  const brands = await Brand.insertMany([
    { name: "AXEL LABS", description: "Advanced clinical grooming", logoUrl: "https://placehold.co/150x50?text=AXEL+LABS" },
    { name: "RUGGED RITUALS", description: "Natural masculine care", logoUrl: "https://placehold.co/150x50?text=RUGGED+RITUALS" },
    { name: "TITAN", description: "Bespoke beard engineering", logoUrl: "https://placehold.co/150x50?text=TITAN" },
  ]);

  // 4. Create Products
  const products = await Product.insertMany([
    {
      name: "Volcanic Ash Face Wash",
      description: "Deep-cleansing charcoal and volcanic ash formula for oily skin. Eliminates impurities without drying.",
      price: 24.00,
      brand: brands[0]._id,
      category: categories[0]._id,
      stock: 50,
      images: [{ url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000", public_id: "seed1" }],
      rating: 4.8,
      numReviews: 124
    },
    {
      name: "Matte Finish Moisturizer",
      description: "Hydration with oil-control. Keeps skin firm and non-greasy throughout the day.",
      price: 32.00,
      brand: brands[0]._id,
      category: categories[0]._id,
      stock: 35,
      images: [{ url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000", public_id: "seed2" }],
      rating: 4.9,
      numReviews: 89
    },
    {
      name: "Sandalwood Beard oil",
      description: "Premium cold-pressed oil for beard softness and skin health under the hair.",
      price: 18.00,
      brand: brands[2]._id,
      category: categories[1]._id,
      stock: 42,
      images: [{ url: "https://images.unsplash.com/photo-1590159763121-7c9fd312190d?q=80&w=1000", public_id: "seed3" }],
      rating: 4.7,
      numReviews: 216
    },
    {
      name: "Retinol Recovery Serum",
      description: "Nighttime serum to reduce fine lines and improve skin texture while you sleep.",
      price: 45.00,
      brand: brands[1]._id,
      category: categories[0]._id,
      stock: 20,
      images: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000", public_id: "seed4" }],
      rating: 5.0,
      numReviews: 45
    }
  ]);

  return { success: true };
}
