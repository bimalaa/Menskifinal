"use client";

import { useState } from "react";
import { register } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        toast.success("Account created successfully");
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-muted/20 p-8 border-2 rounded-none">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Join the Regimen</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Create your MENSKI profile</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="uppercase tracking-widest text-[10px] font-bold">Full Name</Label>
            <Input id="name" name="name" required className="rounded-none bg-background border-2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase tracking-widest text-[10px] font-bold">Email Address</Label>
            <Input id="email" name="email" type="email" required className="rounded-none bg-background border-2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="uppercase tracking-widest text-[10px] font-bold">Password</Label>
            <Input id="password" name="password" type="password" required className="rounded-none bg-background border-2" />
          </div>
          <Button
            type="submit"
            className="w-full rounded-none py-6 uppercase tracking-widest font-bold"
            disabled={loading}
          >
            {loading ? "Engaging..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest">
          Already a member? <Link href="/login" className="font-bold text-primary underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
