import {z} from "zod";
import { prisma } from "../db/db.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";


const AddEmployeeSchema = z.object({
    userId: z.string(),
    role: z.string(),
    department: z.string(),
    isActive: z.boolean().optional(),
});
export const addEmployee = asyncHandler(async (req, res) => {
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

    const validation = AddEmployeeSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {userId, isActive, department, role} = validation.data;

    const userOfEmployee = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });

    if (!userOfEmployee) {
        throw new ApiError(400, "Invalid user UUID");
    }

    const existedEmployee = await prisma.employee.findUnique({
        where: {
            userId
        }
    });

    if (existedEmployee) {
        throw new ApiError(409, "Employee is already been exist");
    }

    const newEmployee = await prisma.employee.create({
        data: {
            userId,
            role: role === "MANAGER" ? 
                "MANAGER" : 
                role === "SUPPORT" ? 
                "SUPPORT" : 
                role === "WAREHOUSE" ? 
                "WAREHOUSE" : 
                "CONTENT",
            department,
            isActive: isActive ? isActive : false
        }
    });

    if (!newEmployee) {
        throw new ApiError(500, "Internal server error creating employee");
    }

    return res.status(201).json(new ApiResponse(201, "Added employee successfully", {employee: newEmployee}));
});


export const getEmployees = asyncHandler(async (req, res) => {
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
    
    const allEmployees = await prisma.employee.findMany();

    return res.status(200).json(new ApiResponse(200, "Fetched employees data", {employees: allEmployees}));
});


const UpdateEmployeeSchema = z.object({
    id: z.string(),
    userId: z.string(),
    role: z.string(),
    department: z.string(),
    isActive: z.boolean().optional(),
});

export const updateEmployee = asyncHandler(async (req, res) => {
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

    const validation = UpdateEmployeeSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {id:employeeId, userId, isActive, department, role} = validation.data;

    const userOfEmployee = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });

    if (!userOfEmployee) {
        throw new ApiError(400, "Invalid user UUID");
    }

    const existedEmployee = await prisma.employee.findUnique({
        where: {
            id: employeeId,
        }
    });

    if (!existedEmployee) {
        throw new ApiError(404, "Employee not found");
    }

    const updatedEmployee = await prisma.employee.update({
        where: {
            id: employeeId,
        },
        data: {
            userId,
            role: role === "MANAGER" ? "MANAGER" : role === "SUPPORT" ? "SUPPORT" : role === "WAREHOUSE" ? "WAREHOUSE": "CONTENT",
            isActive: isActive ? isActive : false,
            department
        }
    });


    if (!updatedEmployee) {
        throw new ApiError(500, "Internal server error updating employee");
    }

    return res.status(200).json(new ApiResponse(200, "Updated employee successfully", {employee: updatedEmployee}));
});


const DeleteEmployeeSchema = z.object({
    employeeId: z.string(),
})
export const deleteEmployee = asyncHandler(async (req, res) => {
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

    const validation = DeleteEmployeeSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Invalid credentials");
    }

    const {employeeId} = validation.data;

    const existedEmployee = await prisma.employee.findUnique({
        where: {
            id: employeeId,
        }
    });

    if (!existedEmployee) {
        throw new ApiError(404, "Employee not found");
    }

    const deletedEmployee = await prisma.employee.delete({
        where: {
            id: employeeId,
        }
    });

    if (!deletedEmployee) {
        throw new ApiError(500, "Internal server error deleting employee");
    }

    return res.status(200).json(new ApiResponse(200, "Deleted employee successfully", {employee: deletedEmployee}));
})