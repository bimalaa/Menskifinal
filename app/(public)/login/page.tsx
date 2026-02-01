"use client";

import { useState } from "react";
import { login } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await login(formData);
      if (res.success) {
        toast.success("Login successful");
        router.push(res.role === "admin" ? "/admin" : "/");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-muted/20 p-8 border-2 rounded-none">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Login to Menski</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Enter your credentials to continue</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase tracking-widest text-[10px] font-bold">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="rounded-none bg-background border-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="uppercase tracking-widest text-[10px] font-bold">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="rounded-none bg-background border-2"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-none py-6 uppercase tracking-widest font-bold"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest">
          Don't have an account? <Link href="/register" className="font-bold text-primary underline">Join the Regimen</Link>
        </p>
      </div>
    </div>
  );
}
