import mongoose, { Schema, Document, model, models, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  stock: number;
  images: { url: string; public_id: string }[];
  rating: number;
  numReviews: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);
export default Product;
