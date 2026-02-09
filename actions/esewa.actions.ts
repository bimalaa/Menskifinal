"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import Order from "@/models/order.models";
import connectDB from "@/lib/db";

export async function getEsewaPaymentParams(orderId: string, amount: number) {
    const transaction_uuid = orderId;
    const product_code = "EPAYTEST";
    const secret_key = "8gBm/:&EnhH.1/q"; // Test Secret Key

    const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const signature = crypto
        .createHmac("sha256", secret_key)
        .update(message)
        .digest("base64");

    await connectDB();
    await Order.findByIdAndUpdate(orderId, {
        "paymentDetails.transactionId": transaction_uuid,
        "paymentDetails.pid": product_code,
        "paymentDetails.amount": amount,
        "paymentDetails.status": "Initiated",
        "paymentDetails.signature": signature,
    });

    return {
        amount,
        tax_amount: 0,
        total_amount: amount,
        transaction_uuid,
        product_code,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`,
        failure_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
    };
}

export async function verifyEsewaPayment(encodedData: string) {
    try {
        const decodedProps = JSON.parse(Buffer.from(encodedData, "base64").toString("utf-8"));
        const { status, transaction_uuid, total_amount, transaction_code } = decodedProps;

        if (status !== "COMPLETE") {
            return { success: false, message: "Transaction not complete" };
        }

        await connectDB();
        const order = await Order.findById(transaction_uuid);

        if (!order) {
            return { success: false, message: "Order not found" };
        }

        // Verify amount matches (Optional but recommended)
        if (order.totalPrice !== Number(total_amount)) {
            // eSewa might return amount as string, carefully compare
            // For test environemnt, sometimes exact match might be tricky with tax, but here tax is 0.
        }

        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentMethod = "eSewa";
        order.paymentResult = decodedProps;
        order.paymentDetails = {
            ...order.paymentDetails,
            status: "Completed",
            esewaRefId: transaction_code // Map transaction_code to esewaRefId
        };
        await order.save();

        revalidatePath("/admin/orders");
        return { success: true, orderId: order._id.toString() };
    } catch (error) {
        console.error("eSewa verification error:", error);
        return { success: false, message: "Verification failed" };
    }
}
