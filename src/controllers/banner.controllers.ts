import {z} from "zod";
import { prisma } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import deleteFile from "../utils/deleteFile.js";

const CreateBannerSchema = z.object({
    title: z.string(),
  imageUrl: z.string(),
  linkUrl: z.string().optional().nullable(),
  position: z.string(),
  sortOrder: z.number(),
  isActive: z.boolean(),
})
export const createBanner = asyncHandler(async (req, res) => {
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

    const validation = CreateBannerSchema.safeParse(req.body);
    console.log(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {
        title,
        imageUrl,
        linkUrl,
        position,
        sortOrder,
        isActive
    } = validation.data;

    const newBanner = await prisma.banner.create({
        data: {
            title, 
            imageUrl,
            linkUrl: linkUrl || null,
            position,
            sortOrder,
            isActive
        }
    });

    if (!newBanner) {
        throw new ApiError(500, "Internal server error creating banner");
    }

    return res.status(201).json(new ApiResponse(201, "Created banner successfully", {banner: newBanner}));
    
});



const UpdateBannerSchema = z.object({
    bannerId: z.string(),
    title: z.string(),
  imageUrl: z.string(),
  linkUrl: z.string().optional().nullable(),
  position: z.string(),
  sortOrder: z.number(),
  isActive: z.boolean(),
});

export const updateBanner = asyncHandler(async (req, res) => {
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

    const validation = UpdateBannerSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {
        bannerId,
        title,
        imageUrl,
        position,
        linkUrl,
        isActive,
        sortOrder,
    } = validation.data;

    const updatedBanner = await prisma.banner.update({
        where: {
            id: bannerId,
        },
        data: {
            title, 
            imageUrl, 
            position, 
            linkUrl: linkUrl || null, 
            isActive, 
            sortOrder
        }
    });

    if (!updatedBanner) {
        throw new ApiError(500, "Internal server error updating banner");
    }

    return res.status(200).json(new ApiResponse(200, "Updated banner successfully"));
});


const DeleteBannerSchema = z.object({
    bannerId: z.string(),
});

export const deleteBanner = asyncHandler(async (req, res) => {
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

    const validation = DeleteBannerSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {bannerId} = validation.data;

    const existedBanner = await prisma.banner.findUnique({
        where: {
            id: bannerId,
        }
    });

    if (!existedBanner) {
        throw new ApiError(404, "Banner not found");
    }

    const path = existedBanner.imageUrl.split("/uploads/");
    const fileId = path[path.length - 1];
    deleteFile(fileId || "");

    const deletedBanner = await prisma.banner.delete({
        where: {
            id: existedBanner.id,
        }
    });

    if (!deletedBanner) {
        throw new ApiError(500, "Internal server error deleting banner");
    }

    return res.status(200).json(new ApiResponse(200, "Deleted banner successfully", {banner: deletedBanner}));
});


export const getBanners = asyncHandler(async (req, res) => {
    const banners = await prisma.banner.findMany();
    return res.status(200).json(new ApiResponse(200, "Successfully fetched banners", {banners}));
})

