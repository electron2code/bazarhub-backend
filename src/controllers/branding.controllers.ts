import {z} from "zod";
import { prisma } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import deleteFile from "../utils/deleteFile.js";

const UpdateBrandingSchema = z.object({
    brandName: z.string(),
})
export const updateBranding = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    });

    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const validation = UpdateBrandingSchema.safeParse(req.body);
    
    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const existingBrandings = await prisma.branding.findMany();

    const { brandName } = validation.data;
    
    if (existingBrandings.length) {
        const brandingId = existingBrandings[0]?.id;
        
        if (!brandingId) {
            throw new ApiError(500, "Internal server error no branding id found");
        }

        const updatedBranding = await prisma.branding.update({
            where: {
                id: brandingId,
            },
            data: {brandName}
        });

        if (!updatedBranding) {
            throw new ApiError(500, "Internal server error updating braning");
        }

        return res.status(200).json(new ApiResponse(200, "Updated branding name successfully", {brandName}));
    }

    const newBranding = await prisma.branding.create({
        data: {
            brandName
        }
    });

    if (!newBranding) {
        throw new ApiError(500, "Internal server error creating branding")
    }

    return res.status(201).json(new ApiResponse(201, "Created branding name successfully", {brandName}));
});


const UpdateBraningLogoSchema = z.object({
    brandLogoUrl: z.string(),
})
export const updateBrandingLogo = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const validation = UpdateBraningLogoSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {brandLogoUrl} = validation.data;

    const existingBrandLogos = await prisma.brandLogo.findMany();

    if (existingBrandLogos.length) {
        const brandLogoId = existingBrandLogos[0]?.id;

        if (!brandLogoId) {
            throw new ApiError(500, "Internal server error no brand logo id found");
        }

        const updatedBrandLogo = await prisma.brandLogo.update({
            where: {
                id: brandLogoId,
            },
            data: {
                url: brandLogoUrl,
            }
        });

        if (!updatedBrandLogo) {
            throw new ApiError(500, "Internal server error updating brand logo");
        }

        return res.status(200).json(new ApiResponse(200, "Brand logo updated successfully", {brandLogoUrl: updatedBrandLogo.url}));
    }
    
    const newBrandLogo = await prisma.brandLogo.create({
        data: {url: brandLogoUrl}
    });

    if (!newBrandLogo) {
        throw new ApiError(500, "Internel server error creating brand logo");
    }

    return res.status(201).json(new ApiResponse(201, "Created brand logo successfully", {brandLogoUrl}));
});


const DeleteBrandingLogoSchema = z.object({
    brandLogoUrl: z.string(),
})
export const deleteBrandingLogo = asyncHandler(async (req, res) => {
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

    const validation = DeleteBrandingLogoSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {brandLogoUrl} = validation.data;

    const existingBrandLogos = await prisma.brandLogo.findMany();

    let existingBrandLogoUrl:string = "";
    let existingBrandLogoId: string = "";
    if (existingBrandLogos.length) {
        existingBrandLogoUrl = existingBrandLogos[0]?.url || "";
        existingBrandLogoId = existingBrandLogos[0]?.id || "";
    }

    if (!existingBrandLogoId) {
        throw new ApiError(404, "No such brand logo found");
    }

    if (!existingBrandLogoUrl) {
        throw new ApiError(404, "No such brand logo found");
    }

    if (existingBrandLogoUrl !== brandLogoUrl) {
        throw new ApiError(400, "Brand logo does not matched");
    }

    const path = brandLogoUrl.split("/uploads/");
    const fileId = path[path.length - 1];

    deleteFile(fileId || "");

    await prisma.brandLogo.delete({
        where: {
            id: existingBrandLogoId,
        }
    });

    return res.status(200).json(new ApiResponse(200, "Deleted brand logo successfully", {brandLogoUrl}));
})


export const getBranding = asyncHandler(async (req, res) => {
    const brandLogos = await prisma.brandLogo.findMany();

    let brandLogoUrl: string = "";
    if (brandLogos.length) {
        brandLogoUrl = brandLogos[0]?.url || "";
    }

    const brandings = await prisma.branding.findMany();

    let brandName:string = "";
    if (brandings.length) {
        brandName = brandings[0]?.brandName || "";
    }

    return res.status(200).json(new ApiResponse(200, "Fetched branding successfully", {brandLogoUrl, brandName}));
});