import { prisma } from "../db/db.js";
import { createFlexPayPayment, verifyFlexPayPayment, } from "../services/flexpay.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { z } from "zod";
const InitiatePaymentSchema = z.object({
    name: z.string(),
    orderId: z.string(),
});
export const initiatePayment = asyncHandler(async (req, res) => {
    // const { name,  orderId } = req.body;
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized access");
    }
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    });
    // console.log(user);
    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }
    const validation = InitiatePaymentSchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }
    const { name, orderId } = validation.data;
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
            userId: user.id,
        }
    });
    if (!order) {
        throw new ApiError(404, "Order is not placed");
    }
    console.log(order.totalAmount);
    const totalAmount = parseInt(order.totalAmount.toString());
    const payment = await createFlexPayPayment({
        cus_name: name,
        cus_email: user.email,
        amount: totalAmount,
        success_url: process.env.FRONTEND_SUCCESS_URL,
        cancel_url: process.env.FRONTEND_CANCEL_URL,
        meta_data: { orderId },
    });
    if (!payment.status) {
        throw new ApiError(500, payment.message || "Payment gateway error!");
    }
    return res.status(200).json(new ApiResponse(200, "Payment initiated successfully", { paymentUrl: payment.payment_url, orderId }));
});
export const verifyPayment = asyncHandler(async (req, res) => {
    const { transactionId } = req.query;
    if (!transactionId || typeof transactionId !== "string") {
        return res.status(400).json({ message: "Invalid transaction id" });
    }
    const verification = await verifyFlexPayPayment(transactionId);
    // ✅ VERY IMPORTANT
    // Update order status in DB here (PAID / FAILED)
    if (!verification.status) {
        throw new ApiError(400, "Something went wrong");
    }
    const orderId = verification.metadata.orderId;
    if (!orderId) {
        throw new ApiError(400, "Something went wrong");
    }
    const order = await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            paymentStatus: "PAID",
        }
    });
    if (!order) {
        throw new ApiError(400, "Something went wrong");
    }
    const deletedCart = await prisma.cart.findUnique({
        where: {
            userId: order.userId
        }
    });
    if (!deletedCart) {
        // do something
    }
    return res.status(200).json(new ApiResponse(200, "Payment made and order updated successfully", { verification, order }));
});
