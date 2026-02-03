import asyncHandler from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { prisma } from "../db/db.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import {z} from "zod";
import type { OrderStatus } from "../../generated/prisma/enums.ts";

const addressSchema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    phone: z.string().min(10, "Phone is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(3, "City is required"),
    postalCode: z.string().min(4, "Postal code is required"),
});

const orderItemsSchema = z.array(z.object({
    productId: z.string().min(1, "Product ID is required"),
}));

const CreateOrderSchema = z.object({
    shippingAddress: addressSchema,
    orderItems: orderItemsSchema,
});

export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, orderItems } = req.body;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const id = (req as any).user.id;
    console.log(id);
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    // console.log(user);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const validation = CreateOrderSchema.safeParse({ shippingAddress, orderItems });
    if (!validation.success) {
        throw new ApiError(400, validation.error.message);
    }

    const cart = await prisma.cart.findUnique({
        where: {
            userId: id
        }
    });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    
    const cartItems = await prisma.cartItem.findMany({
        where: {
            cartId: cart.id,
        }
    });

    const totalCartPrice = cartItems.reduce((acc, item) => {
        if (item.buyerType === "RETAIL") {
            return acc + Number(item.retailPrice) * item.quantity;
        } else if (item.buyerType === "WHOLESALE" && item.minWholesaleQty <= item.quantity) {
            return acc + Number(item.wholesalePrice) * item.quantity;
        }
        return acc + Number(item.retailPrice);
    }, 0);

    const order = await prisma.order.create({
        data: {
            userId: id,
            orderNumber,
            shippingAddress: {
                create: {
                    fullName: shippingAddress.fullName,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    phone: shippingAddress.phone,
                    postalCode: shippingAddress.postalCode
                }
            },
            totalAmount: totalCartPrice,
            status: "PENDING",
            paymentStatus: "PENDING",
            items: {
                create: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.retailPrice,
                })),
            },
        },
    });
    return res.status(200).json(new ApiResponse(200, "Order created successfully", { order })); 
});

export const createCODOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, orderItems } = req.body;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const id = (req as any).user.id;
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

    const validation = CreateOrderSchema.safeParse({ shippingAddress, orderItems });
    if (!validation.success) {
        throw new ApiError(400, validation.error.message);
    }

    const cart = await prisma.cart.findUnique({
        where: {
            userId: id
        }
    });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    
    const cartItems = await prisma.cartItem.findMany({
        where: {
            cartId: cart.id,
        }
    });
    const totalCartPrice = cartItems.reduce((acc, item) => {
        if (item.buyerType === "RETAIL") {
            return acc + Number(item.retailPrice) * item.quantity;
        } else if (item.buyerType === "WHOLESALE" && item.minWholesaleQty <= item.quantity) {
            return acc + Number(item.wholesalePrice) * item.quantity;
        }
        return acc;
    }, 0);
    console.log(totalCartPrice);

    const order = await prisma.order.create({
        data: {
            userId: id,
            orderNumber,
            shippingAddress: {
                create: {
                    fullName: shippingAddress.fullName,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    phone: shippingAddress.phone,
                    postalCode: shippingAddress.postalCode
                }
            },
            totalAmount: totalCartPrice,
            status: "PENDING",
            paymentStatus: "PENDING",
            items: {
                create: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.retailPrice,
                })),
            },
        },
    });
    return res.status(200).json(new ApiResponse(200, "Order created successfully", { order }));
});


export const getOrders = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: id,
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: id,
        },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            images: true,
                        },
                    },
                },
            },
            shippingAddress: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // console.log(orders);
    return res.status(200).json(new ApiResponse(200, "Orders found", {orders}));
});


export const getAllOrders = asyncHandler(async (req, res) => {
    const id = (req as any).user.id;
    const status = req.query.status as OrderStatus;

    if (!id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await prisma.user.findUnique({
        where: {id}
    });

    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    if (user.role !== "ADMIN") {
        throw new ApiError(401, "Unauthorized access");
    }

    const orders = await prisma.order.findMany({
        where: {
            status: status
        },
        include: {
            user: {
                select: {
                    type: true,
                }
            }
        }
    })

    res.status(200).json(new ApiResponse(200, "Successfully fetched order", {orders}));
})