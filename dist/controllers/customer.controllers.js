import { z } from "zod";
import { prisma } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
export const getCustomers = asyncHandler(async (req, res) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized access");
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
    const customers = await prisma.user.findMany({
        where: {
            id: {
                not: id
            },
            role: {
                notIn: ["ADMIN"]
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            type: true,
            role: true,
            createdAt: true,
            orders: {
                select: {
                    orderNumber: true,
                    id: true,
                }
            }
        }
    });
    // console.log(customers);
    return res.status(200).json(new ApiResponse(200, "Successfully fetched customers data", { customers }));
});
const UpdateCustomerSchema = z.object({
    customerId: z.string(),
    customerType: z.string(),
});
export const updateCustomerType = asyncHandler(async (req, res) => {
    const id = req.user.id;
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
    const validation = UpdateCustomerSchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }
    const { customerId, customerType } = validation.data;
    const customer = await prisma.user.findUnique({
        where: {
            id: customerId,
            role: {
                not: "ADMIN",
            }
        }
    });
    if (!customer) {
        throw new ApiError(404, "Customer is not found");
    }
    const updatedCustomer = await prisma.user.update({
        where: {
            id: customerId,
        },
        data: {
            type: customerType === "WHOLESALE" ? "WHOLESALE" : "RETAIL"
        }
    });
    if (!updatedCustomer) {
        throw new ApiError(500, "Internal server error");
    }
    return res.status(200).json(new ApiResponse(200, "Successfully updated the customers type", { customerId, customerType }));
});
