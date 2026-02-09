"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentFailurePage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <XCircle className="h-24 w-24 text-destructive" />
            <h1 className="text-4xl font-bold uppercase tracking-tighter">Transaction Failed</h1>
            <p className="text-muted-foreground uppercase tracking-widest">Your payment could not be processed.</p>
            <Button onClick={() => router.push("/checkout")} className="uppercase tracking-widest font-bold rounded-none px-8 py-6">
                Return to Checkout
            </Button>
        </div>
    );
}
