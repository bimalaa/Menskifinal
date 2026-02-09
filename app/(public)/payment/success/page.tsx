"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEsewaPayment } from "@/actions/esewa.actions";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const data = searchParams.get("data");

    useEffect(() => {
        const verify = async () => {
            if (!data) {
                setStatus("error");
                return;
            }

            const res = await verifyEsewaPayment(data);
            if (res.success) {
                setStatus("success");
                // Clear local storage cart
                localStorage.removeItem("menski-cart");
            } else {
                setStatus("error");
            }
        };

        verify();
    }, [data]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-xl font-bold uppercase tracking-widest">Verifying Payment...</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <XCircle className="h-24 w-24 text-destructive" />
                <h1 className="text-4xl font-bold uppercase tracking-tighter">Payment Failed</h1>
                <p className="text-muted-foreground uppercase tracking-widest">We couldn't verify your transaction.</p>
                <Button onClick={() => router.push("/checkout")} variant="outline" className="uppercase tracking-widest font-bold">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-32 text-center space-y-6">
            <CheckCircle className="mx-auto h-24 w-24 text-primary" />
            <h1 className="text-5xl font-bold uppercase tracking-tighter">Mission Accomplished</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto uppercase tracking-widest font-medium">
                Your order has been confirmed and is being prepped for dispatch.
            </p>
            <Button
                onClick={() => router.push("/")}
                className="rounded-none px-12 py-6 uppercase tracking-widest font-bold"
            >
                Return to Base
            </Button>
        </div>
    );
}
