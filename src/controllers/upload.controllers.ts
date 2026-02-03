import asyncHandler from "../utils/asyncHandler.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { ApiError } from "../utils/apiError.ts";
import deleteFile from "../utils/deleteFile.ts";
import {z} from "zod";

export const categoryThumbnail = asyncHandler((req, res) => {
    if (req.file) {
        return res.status(200).json(new ApiResponse(200, "File uploaded successfully", { filename: req.file.filename }));
    } else {
        throw new ApiError(400, "File upload failed");
    }
})

export const productThumbnail = asyncHandler((req, res) => {
    if (req.file) {
        return res.status(200).json(new ApiResponse(200, "File uploaded successfully", { filename: req.file.filename }));
    } else {
        throw new ApiError(400, "File upload failed");
    }
})


export const deleteProductThumbnail = asyncHandler((req, res) => {
    const { filename } = req.body;
    if (!filename) {
        throw new ApiError(400, "File name is required");
    }
    deleteFile(filename);
    return res.status(200).json(new ApiResponse(200, "File deleted successfully"));
});


export const createBrandingLogo = asyncHandler((req, res) => {
    if (req.file) {
        return res.status(200).json(new ApiResponse(200, "Uploaded branding logo successfully", {filename: req.file.filename}));
    } else {
        throw new ApiError(400, "File upload failed");
    }
});


export const createBannerImage = asyncHandler((req, res) => {
    if (req.file) {
        return res.status(200).json(new ApiResponse(200, "Uploaded banner image successfully", {filename: req.file.filename}));
    } else {
        throw new ApiError(400, "File upload failed");
    }
});


const DeleteBannerImageSchema = z.object({
    bannerImageUrl: z.string(),
})
export const deleteBannerImage = asyncHandler(async (req, res) => {
    const validation = DeleteBannerImageSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {bannerImageUrl} = validation.data;

    const path = bannerImageUrl.split("/uploads/");
    const fileId = path[path.length - 1];

    deleteFile(fileId || "");

    return res.status(200).json(new ApiResponse(200, "Deleted banner image successfully", {bannerImageUrl}));
})