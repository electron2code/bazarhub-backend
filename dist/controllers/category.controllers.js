import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../db/db.js";
import { z } from "zod";
import deleteFile from "../utils/deleteFile.js";
const CreateCategorySchema = z.object({
    name_en: z.string().min(3, "Category name must be at least 3 characters long"),
    name_bn: z.string().nullable(),
    slug: z.string(),
    imageUrl: z.string().url("Invalid URL"),
    parentCategoryId: z.string().nullable(),
    sortOrder: z.number().nullable(),
    isActive: z.boolean().nullable(),
});
export const createCategory = asyncHandler(async (req, res) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    const validation = CreateCategorySchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(400, validation.error.message);
    }
    const { name_en, name_bn, imageUrl, parentCategoryId, sortOrder, isActive, slug } = validation.data;
    const category = await prisma.category.create({
        data: {
            name_en,
            name_bn: name_bn || "",
            imageUrl: imageUrl || "",
            parentCategoryId: parentCategoryId || null,
            sortOrder: sortOrder || 0,
            isActive: isActive || true,
            slug: slug,
        }
    });
    return res.status(201).json(new ApiResponse(201, "Category created successfully", category));
});
const UpdateCategorySchema = z.object({
    categoryId: z.string(),
    name_en: z.string().min(3, "Category name must be at least 3 characters long"),
    name_bn: z.string().nullable(),
    slug: z.string(),
    imageUrl: z.string().url("Invalid URL"),
    parentCategoryId: z.string().nullable(),
    sortOrder: z.number().nullable(),
    isActive: z.boolean().nullable(),
});
export const updateCategory = asyncHandler(async (req, res) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    const validation = UpdateCategorySchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(400, validation.error.message);
    }
    const { categoryId, name_en, name_bn, imageUrl, parentCategoryId, sortOrder, isActive, slug } = validation.data;
    const category = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: {
            name_en,
            name_bn: name_bn || "",
            imageUrl: imageUrl || "",
            parentCategoryId: parentCategoryId || null,
            sortOrder: sortOrder || 0,
            isActive: isActive || true,
            slug: slug,
        }
    });
    return res.status(200).json(new ApiResponse(200, "Category updated successfully", category));
});
const DeleteCategorySchema = z.object({
    categoryId: z.string(),
});
export const deleteCategory = asyncHandler(async (req, res) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    const validation = DeleteCategorySchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(400, validation.error.message);
    }
    const { categoryId } = validation.data;
    const category = await prisma.category.delete({
        where: {
            id: categoryId
        }
    });
    if (category?.imageUrl) {
        const imageId = category?.imageUrl.split("/uploads/").pop() || "";
        await deleteFile(imageId);
    }
    return res.status(200).json(new ApiResponse(200, "Category deleted successfully", category));
});
const BulkDeleteCategoriesSchema = z.object({
    categoryIds: z.array(z.string()),
});
export const bulkDeleteCategories = asyncHandler(async (req, res) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Unauthorized");
    }
    const validation = BulkDeleteCategoriesSchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(400, validation.error.message);
    }
    const { categoryIds } = validation.data;
    for (const categoryId of categoryIds) {
        const category = await prisma.category.delete({
            where: {
                id: categoryId
            }
        });
        if (category?.imageUrl) {
            const imageId = category?.imageUrl.split("/uploads/").pop() || "";
            await deleteFile(imageId);
        }
    }
    return res.status(200).json(new ApiResponse(200, "Category deleted successfully", categoryIds));
});
const GetCategorySchema = z.object({
    categoryId: z.string(),
});
export const getCategory = asyncHandler(async (req, res) => {
    const { categoryId } = GetCategorySchema.parse(req.body);
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    });
    return res.status(200).json(new ApiResponse(200, "Category fetched successfully", category));
});
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
        where: {
            isActive: true
        },
        include: {
            parentCategory: true,
            childCategories: true
        }
    });
    return res.status(200).json(new ApiResponse(200, "Categories fetched successfully", categories));
});
