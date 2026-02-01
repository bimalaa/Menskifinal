"use client";

import { fixPlaceholderUrls } from "@/actions/fix-placeholders.actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function FixImagesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFix = async () => {
    setLoading(true);
    try {
      const res = await fixPlaceholderUrls();
      setResult(res);
      toast.success("Placeholders updated!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-20 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-black uppercase tracking-tighter">Database Migration</h1>
      <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold opacity-70">
        Updating unstable via.placeholder.com URLs to placehold.co
      </p>

      {result ? (
        <div className="bg-muted p-8 border-2 border-primary/20 space-y-4">
          <p className="font-bold uppercase tracking-widest text-xs">Migration Results:</p>
          <pre className="text-sm bg-background p-4 border overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
          <Link href="/admin">
            <Button className="w-full rounded-none font-bold uppercase tracking-widest">Go to Admin</Button>
          </Link>
        </div>
      ) : (
        <Button
          onClick={handleFix}
          disabled={loading}
          className="h-20 w-full rounded-none text-xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
        >
          {loading ? "Migrating Data..." : "Run Migration"}
        </Button>
      )}
    </div>
  );
}
