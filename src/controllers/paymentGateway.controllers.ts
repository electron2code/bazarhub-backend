import {z} from "zod";
import { prisma } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../utils/apiResponse.js";


const AddPaymentGatewaySchema = z.object({
    gateway_id: z.string(),
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    is_enabled: z.boolean(),
    is_configured: z.boolean(),
    config: z.object({
        api_key: z.string()
    })
})


export const addPaymentGateway = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const validation = AddPaymentGatewaySchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {gateway_id, name, description, icon, config, is_configured, is_enabled} = validation.data;

    const newPaymentGateway = await prisma.paymentGateway.create({
        data: {
            gateway_id,
            name,
            description,
            icon,
            config: {
                create: {
                    api_key: config.api_key
                }
            },
            is_configured,
            is_enabled
        }
    });
    
    if (!newPaymentGateway) {
        throw new ApiError(500, "Internal server error creating payment gateway");
    }

    return res.status(201).json(new ApiResponse(200, "Created payment gateway successfully", {paymentGateway: {...newPaymentGateway, config: {api_key: config.api_key}}}));
});

const UpdatePaymentGatewaySchema = z.object({
    id: z.string(),
    gateway_id: z.string(),
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    is_enabled: z.boolean(),
    is_configured: z.boolean(),
    config: z.object({
        api_key: z.string()
    }),
});

export const updatePaymetGateway = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const validation = UpdatePaymentGatewaySchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {id:paymentGatewayId, config, ...updates} = validation.data;

    const existedPaymentGateway = await prisma.paymentGateway.findUnique({
        where: {
            id: paymentGatewayId
        }
    });

    if (!existedPaymentGateway) {
        throw new ApiError(404, "Payment gateway not found");
    }

    const updatedPaymentGateWay = await prisma.paymentGateway.update({
        where: {
            id: paymentGatewayId,
        },
        data: {
            ...updates,
            config: {
                update: {
                    api_key: config.api_key
                }
            }
        },
        include: {
            config: true
        }
    });

    if (!updatedPaymentGateWay) {
        throw new ApiError(500, "Internal server error updating payment gateway");
    }

    return res.status(200).json(new ApiResponse(200, "Updated payment gateway successfully", {paymentGateway: updatedPaymentGateWay}));
});


export const getPaymetGateways = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const existedPaymentGateways = await prisma.paymentGateway.findMany({
        include: {
            config: true
        }
    });

    return res.status(200).json(new ApiResponse(200, "Fetched payment gateways", {paymentGateways: existedPaymentGateways}));
    
});
export const getPaymetGatewaysClient = asyncHandler(async (req, res) => {
    const existedPaymentGateways = await prisma.paymentGateway.findMany();

    return res.status(200).json(new ApiResponse(200, "Fetched payment gateways", {paymentGateways: existedPaymentGateways}));
    
});



const DeletePaymentGatewaySchema = z.object({
    id: z.string(),
})
export const deletePaymentGateway = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const validation = DeletePaymentGatewaySchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {id: gatewayId} = validation.data;

    const existedPaymentGateway = await prisma.paymentGateway.findUnique({
        where: {
            id: gatewayId,
        }
    });

    if (!existedPaymentGateway) {
        throw new ApiError(404, "Payment gateway not found");
    }

    const deletedPaymentGateway = await prisma.paymentGateway.delete({
        where: {
            id: existedPaymentGateway.id
        }
    });

    if (!deletedPaymentGateway) {
        throw new ApiError(500, "Internal server error deleting payment gateway");
    }

    return res.status(200).json(new ApiResponse(200, "Deleted payment gateway successfully", {paymentGateway: deletedPaymentGateway}));

})