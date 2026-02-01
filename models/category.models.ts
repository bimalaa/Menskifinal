import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Category = models.Category || model<ICategory>("Category", CategorySchema);
export default Category;
