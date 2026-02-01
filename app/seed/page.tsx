"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import connectDB from "@/lib/db";
import Category from "@/models/category.models";
import Brand from "@/models/brand.models";
import Product from "@/models/products.models";

// Since we can't easily run complex server logic inside a client component effortlessly with Mongoose models without server actions, 
// I'll define a server action for seeding and call it here.

// import { seedDatabase } from "@/actions/seed.actions";

import { seedDatabase } from "@/actions/seed.actions";
export default function SeedPage() {
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    setLoading(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        toast.success("Database seeded successfully");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 text-center space-y-8">
      <h1 className="text-4xl font-bold uppercase tracking-tighter">System Initialization</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        This utility will populate the database with essential categories, premium brands, and initial inventory tokens.
      </p>
      <Button
        onClick={handleSeed}
        disabled={loading}
        size="lg"
        className="rounded-none uppercase tracking-[0.2em] font-bold px-12 py-8"
      >
        {loading ? "Initializing..." : "Seed Database"}
      </Button>
    </div>
  );
}
