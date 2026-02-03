import { prisma } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { z } from "zod";
import deleteFile from "../utils/deleteFile.js";

const CreateProductSchema = z.object({
    name_en: z.string().min(3, "Name must be at least 3 characters long"),
    name_bn: z.string(),
    description_en: z.string(),
    description_bn: z.string(),
    categoryId: z.string(),
    retailPrice: z.number(),
    wholesalePrice: z.number(),
    stock: z.number(),
    minWholesaleQty: z.number(),
    sku: z.string(),
    visibility: z.string(),
    images: z.array(z.string()),
    isActive: z.boolean(),
    isInhouse: z.boolean(),
    sellerId: z.string().nullable(),
    slug: z.string().optional(),
})

export const createProduct = asyncHandler(async (req, res) => {
    const data = req.body;

    const validation = CreateProductSchema.safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, validation.error.message);
    }
    const { name_bn, name_en, description_bn, description_en, categoryId, retailPrice, wholesalePrice, stock, minWholesaleQty, sku, visibility, isActive, isInhouse, images } = validation.data;
    const product = await prisma.product.create({
        data: {
            name_en,
            name_bn,
            description_en,
            description_bn,
            categoryId: categoryId || null,
            retailPrice,
            wholesalePrice,
            stock,
            minWholesaleQty,
            sku,
            visibility: visibility === "BOTH" ? "BOTH" : visibility === "RETAIL" ? "RETAIL" : "WHOLESALE",
            isActive,
            isInhouse,
        }
    });

    const productImages = await prisma.productImage.createMany({
        data: images.map((image: any) => ({
            productId: product.id,
            url: image,
        })),
    });

    return res.status(201).json(new ApiResponse(201, "Product created successfully", product));
});


export const getProducts = asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({
        include: {
            images: true,
            category: {
                select: {
                    name_en: true,
                    name_bn: true,
                }
            }
        },
    });
    return res.status(200).json(new ApiResponse(200, "Products fetched successfully", products));
});


export const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const images = await prisma.productImage.findMany({
        where: {
            productId: productId,
        },
        select: {
            url: true,
        }
    });

    const product = await prisma.product.delete({
        where: {
            id: productId,
        },
    });

    for (const image of images) {
        const fileId = image.url.split("/uploads/").pop() as string;
        await deleteFile(fileId);
    }

    return res.status(200).json(new ApiResponse(200, "Product deleted successfully", product));
});


export const updateProduct = asyncHandler(async (req, res) => {
    const { productId, updateData } = req.body;

    const productExists = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!productExists) {
        throw new ApiError(404, "Product not found");
    }

    const ExistedImages = await prisma.productImage.findMany({
        where: {
            productId: productId,
        },
        select: {
            url: true,
        }
    });

    for (const image of ExistedImages) {
        const imageUrl = image.url

        for (const img of updateData.images) {
            if (imageUrl === img) {
                continue;
            }
            const fileId = img.split("/uploads/").pop() as string;
            await deleteFile(fileId);
        }
    }

    await prisma.productImage.deleteMany({
        where: {
            productId: productId,
        }
    });

    const { images, categoryId, ...restUpdateData }: { images: string[], categoryId: string, restUpdateData: any } = updateData;

    const product = await prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            ...restUpdateData,
            categoryId: categoryId || null,
            images: {
                create: images.map((image: any) => ({
                    url: image
                }))
            }
        },
    });

    return res.status(200).json(new ApiResponse(200, "Product updated successfully", product));
});

