import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

// Minimal Schemas
const BrandSchema = new mongoose.Schema({
  logoUrl: String
}, { strict: false });

const ProductSchema = new mongoose.Schema({
  images: [{ url: String }]
}, { strict: false });

const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Update Brands
    const brands = await Brand.find({ logoUrl: /via\.placeholder\.com/ });
    console.log(`Found ${brands.length} brands to update.`);
    for (const brand of brands) {
      brand.logoUrl = brand.logoUrl.replace("via.placeholder.com", "placehold.co");
      await brand.save();
      console.log(`Updated brand: ${brand._id}`);
    }

    // Update Products
    const products = await Product.find({ "images.url": /via\.placeholder\.com/ });
    console.log(`Found ${products.length} products to update.`);
    for (const product of products) {
      product.images = product.images.map((img) => ({
        ...img,
        url: img.url.replace("via.placeholder.com", "placehold.co")
      }));
      await product.save();
      console.log(`Updated product: ${product._id}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
