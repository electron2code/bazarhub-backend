import asyncHandler from "../utils/asyncHandler.ts";
import { prisma } from "../db/db.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { ApiError } from "../utils/apiError.ts";
import type { Cart } from "../../generated/prisma/browser.ts";

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const id = (req as any).user.id;
    if (!id) {
        throw new ApiError(401, "User not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    })
    const existCart = await prisma.cart.findUnique({
        where: {
            userId: id,
        },
    });

    let cart: Cart | null = null;
    if (!existCart) {
        cart = await prisma.cart.create({
            data: {
                userId: id,
            },
        });
    } else {
        cart = existCart;
    }

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const existCartItem = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
    });
    if (existCartItem) {
        await prisma.cartItem.update({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
            data: {
                quantity,
            },
        });
        return res.status(200).json(new ApiResponse(200, "Product updated in cart"));
    }
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        include: {
            images: true,
        },
    });
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    if (product.stock < quantity) {
        throw new ApiError(400, "Not enough stock");
    }
    await prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId,
            quantity,
            buyerType: user?.type || "RETAIL",
            image: product.images[0]?.url || "",
            name: product.name_en,
            minWholesaleQty: product.minWholesaleQty,
            retailPrice: product.retailPrice || 0,
            wholesalePrice: product.wholesalePrice || 0,
        },
    });
    return res.status(200).json(new ApiResponse(200, "Product added to cart"));
});



export const getCartItems = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;

    if (!id) {
        throw new ApiError(400, "Unauthorized access")
    }

    const cart = await prisma.cart.findUnique({
        where: {
            userId: id,
        },
        select: {
            items: true,
            id: true,
        }
    });

    res.status(200).json(new ApiResponse(200, "Suceessfully find cart", cart));
});


export const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const id = (req as any).user.id;

    if (!productId) {
        throw new ApiError(400, "Product id is required")
    }

    if (!id) {
        throw new ApiError(400, "Unauthorized access")
    }

    const cart = await prisma.cart.findUnique({
        where: {
            userId: id,
        },
        select: {
            items: true,
            id: true,
        }
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }

    const item = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        }
    });

    if (!item) {
        throw new ApiError(404, "Cart item not found")
    }

    await prisma.cartItem.delete({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        }
    });

    res.status(200).json(new ApiResponse(200, "Suceessfully removed cart item", item));
});


export const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const id = (req as any).user.id;

    if (!productId) {
        throw new ApiError(400, "Product id is required")
    }

    if (!id) {
        throw new ApiError(400, "Unauthorized access")
    }

    const cart = await prisma.cart.findUnique({
        where: {
            userId: id,
        },
        select: {
            items: true,
            id: true,
        }
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }

    const item = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        }
    });

    if (!item) {
        throw new ApiError(404, "Cart item not found")
    }

    await prisma.cartItem.update({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
        data: {
            quantity,
        }
    });

    return res.status(200).json(new ApiResponse(200, "Suceessfully updated cart item quantity", item));
});


export const clearCart = asyncHandler(async (req, res) => {
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
        throw new ApiError(404, "User not found");
    }

    const cart = await prisma.cart.delete({
        where: {
            userId: user.id,
        }
    })

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    return res.status(200).json(new ApiResponse(200, "Cart is clear", {cart}));
})
