import {z} from "zod";
import asyncHandler from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { prisma } from "../db/db.ts";
import { ApiResponse } from "../utils/apiResponse.ts";


const AddDeliveryPersonnelSchema = z.object({
    name: z.string(),
    phoneNumber: z.string(),
    email: z.string(),
    isActive: z.boolean(),
})
export const addDeliveryPersonnel = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const validation = AddDeliveryPersonnelSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {name, email, phoneNumber, isActive} = validation.data;

    const deliveryPersonnel = await prisma.deliveryPersonnel.create({
        data: {
            name,
            email,
            phoneNumber,
            isActive
        }
    });

    if (!deliveryPersonnel) {
        throw new ApiError(500, "Internal server error creating delivery personnel");
    }

    return res.status(201).json(new ApiResponse(201, "Added delivery personnel successfully", {deliveryPersonnel}));
});


export const getDeliveryPersonnels = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const deliveryPersonnels = await prisma.deliveryPersonnel.findMany();

    return res.status(200).json(new ApiResponse(200, "Fetched delivery personnels", {deliveryPersonnels}));
});


const UpdateDeliveryPersonnelSchema = z.object({
    id: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    email: z.string(),
    isActive: z.boolean(),
})
export const updateDeliveryPersonnel = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const validation = UpdateDeliveryPersonnelSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {id: deliveryPersonnelId, name, email, phoneNumber, isActive} = validation.data;

    const existedDeliveryPersonnel = await prisma.deliveryPersonnel.findUnique({
        where: {
            id: deliveryPersonnelId,
        }
    });

    if (!existedDeliveryPersonnel) {
        throw new ApiError(404, "Delivery personnel not found");
    }

    const updatedDeliveryPersonnel = await prisma.deliveryPersonnel.update({
        where: {
            id: deliveryPersonnelId,
        },
        data: {
            name,
            email,
            phoneNumber,
            isActive
        }
    });

    if (!updatedDeliveryPersonnel) {
        throw new ApiError(500, "Internal server error updating delivery personnel");
    }

    return res.status(200).json(new ApiResponse(200, "Updated delivery personnel successfully", {deliveryPersonnel: updatedDeliveryPersonnel}));
});


const DeleteDeliveryPersonnelSchema = z.object({
    id: z.string(),
})
export const deleteDeliveryPersonnel = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const validation = DeleteDeliveryPersonnelSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {id: deliveryPersonnelId} = validation.data;

    const existedDeliveryPersonnel = await prisma.deliveryPersonnel.findUnique({
        where: {
            id: deliveryPersonnelId,
        }
    });

    if (!existedDeliveryPersonnel) {
        throw new ApiError(404, "Delivery personnel not found");
    }

    const deletedDeliveryPersonnel = await prisma.deliveryPersonnel.delete({
        where: {
            id: deliveryPersonnelId,
        }
    });

    if (!deletedDeliveryPersonnel) {
        throw new ApiError(500, "Internal server error deleting delivery personnel");
    }

    return res.status(200).json(new ApiResponse(200, "Deleted delivery personnel successfully", {deliveryPersonnel: deletedDeliveryPersonnel}));
})