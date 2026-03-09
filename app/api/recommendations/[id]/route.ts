import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/products.models";

const COMPLEMENTARY_MAPPING: Record<string, string[]> = {
    "facewash": ["moisturizer", "serum", "lotion", "pimple patch"],
    "moisturizer": ["facewash", "serum", "beard oil"],
    "beard oil": ["beard balm", "beard wash", "beard care"],
    "body wash": ["body lotion"]
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const currentProduct = await Product.findById(id).populate("category brand");
        if (!currentProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const allProducts = await Product.find({ _id: { $ne: id } }).populate("category brand");

        const scoredProducts = allProducts.map(product => {
            let score = 0;

            const currentType = currentProduct.type?.toLowerCase();
            const productType = product.type?.toLowerCase();

            if (currentType && productType) {
                if (COMPLEMENTARY_MAPPING[currentType]?.includes(productType)) {
                    score += 8;
                }
            }

            return { product, score };
        });

        // Sort by score descending
        scoredProducts.sort((a, b) => b.score - a.score);

        // Take top 8
        const recommendations = scoredProducts.slice(0, 8).map(item => item.product);

        return NextResponse.json(recommendations);
    } catch (error) {
        console.error("Recommendation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
