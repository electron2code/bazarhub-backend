import { prisma } from "../db/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
    const totalBanners = await prisma.banner.count();
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const totalCustomers = await prisma.user.count({
        where: {
            role: "USER",
        },
    });
    const totalRetailCustomers = await prisma.user.count({
        where: {
            type: "RETAIL",
            role: "USER",
        },
    });
    const totalWholesaleCustomers = await prisma.user.count({
        where: {
            type: "WHOLESALE",
            role: "USER",
        },
    });
    const totalOrders = await prisma.order.count();
    const recentOrders = await prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        include: {
          items: true,
          user: {
            select: {
                id: true,
                type: true,
            }
          }
        },
    });
    const totalPendingOrders = await prisma.order.count({
        where: {
            status: "PENDING",
        }
    })
    const totalSales = await prisma.order.aggregate({
        _sum: {
            totalAmount: true,
        },
    });

    const totalCompletedOrders = await prisma.order.count({
        where: {
            status: "COMPLETED",
        },
    });

    const totalCancelledOrders = await prisma.order.count({
        where: {
            status: "CANCELLED",
        },
    });

    const totalReturnedOrders = await prisma.order.count({
        where: {
            status: "RETURNED",
        },
    });

    const totalRefundedOrders = await prisma.order.count({
        where: {
            status: "REFUNDED",
        },
    });

    const totalPendingRefundOrders = await prisma.order.count({
        where: {
            status: "PENDING_REFUND",
        },
    });

    const totalCompletedRefundOrders = await prisma.order.count({
        where: {
            status: "COMPLETED_REFUND",
        },
    });

    const totalCancelledRefundOrders = await prisma.order.count({
        where: {
            status: "CANCELLED_REFUND",
        },
    });

    const totalReturnedRefundOrders = await prisma.order.count({
        where: {
            status: "RETURNED_REFUND",
        },
    });

    const totalRefundedRefundOrders = await prisma.order.count({
        where: {
            status: "REFUNDED_REFUND",
        },
    });
    const totalDeliveryPersonells = await prisma.deliveryPersonnel.count();
    return res.status(200).json(
        new ApiResponse(
            200,
            "Dashboard stats fetched successfully",
            {
                totalBanners,
                totalProducts,
                totalCategories,
                totalCustomers,
                totalRetailCustomers,
                totalWholesaleCustomers,
                totalOrders,
                recentOrders,
                totalSales,
                totalPendingOrders,
                totalCompletedOrders,
                totalCancelledOrders,
                totalReturnedOrders,
                totalRefundedOrders,
                totalPendingRefundOrders,
                totalCompletedRefundOrders,
                totalCancelledRefundOrders,
                totalReturnedRefundOrders,
                totalRefundedRefundOrders,
                totalDeliveryPersonells
            },
        )
    );
});