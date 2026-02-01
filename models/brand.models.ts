import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IBrand extends Document {
  name: string;
  description?: string;
  logoUrl?: string;
  logoPublicId?: string;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    logoUrl: { type: String },
    logoPublicId: { type: String },
  },
  { timestamps: true }
);

const Brand = models.Brand || model<IBrand>("Brand", BrandSchema);
export default Brand;
