import asyncHandler from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { generateEmailVerificationToken } from "../utils/generateEmailToken.ts";
import { sendEmail } from "../utils/sendEmail.ts";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../db/db.ts";

import { z } from "zod";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.ts";

const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    name: z.string().min(3, "Name must be at least 3 characters long"),
    type: z.enum(["RETAIL", "WHOLESALE"]),
});

export const register = asyncHandler(async (req, res) => {
    const { email, password, name, type } = req.body;
    const validation = registerSchema.safeParse({ email, password, name, type });

    if (!validation.success) {
        throw new ApiError(400, validation.error.message);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const admins = process.env.ADMIN_EMAILS?.split(",") || [];
    const isAdmin = admins.includes(email);

    const { token, hashedToken, expires } = generateEmailVerificationToken();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: expires,
            role: isAdmin ? "ADMIN" : "USER",
            type,
        },
    });

    const verifyUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;

    await sendEmail(
        user.email,
        "Verify your email",
        `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `
    );

    res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Registration successful. Please check your email to verify.",
            )
        );
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token) {
        throw new ApiError(400, "Invalid verification token");
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token as string)
        .digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: {
                gt: new Date(),
            },
        },
    });

    if (!user) {
        throw new ApiError(400, "Token is invalid or expired");
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            isEmailVerified: true,
            emailVerificationToken: null,
            emailVerificationExpiry: null,
        },
    });

    // res
    //     .status(200)
    //     .json(new ApiResponse(200, "Email verified successfully")).redirect("http://localhost:8080/");
    res
        .status(200)
        .send(`
            <div>
                <h1 style="text-align: center; color: green; font-size: 36px; font-weight: bold;">Welcome To BazarHub</h1>
                <p style="color: green;text-align: center;padding: 20px;">Email verified successfully!</p>
                <p style="text-align: center; color: green; font-size: 24px; font-weight: bold;">Happy Shopping</p>
                <a href="http://localhost:8080/">Go To BazarHub</a>
            </div>
            `);
});


const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
        throw new ApiError(400, validation.error.message);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.isEmailVerified) {
        throw new ApiError(400, "Please verify your email first");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password as string);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken, accessTokenMaxAge, refreshTokenMaxAge } = generateAccessAndRefreshToken(user.id);


    await prisma.user.update({
        where: {
            id: user.id,
            email: user.email,
        },
        data: {
            refreshToken,
            refreshTokenExpiry: new Date(Date.now() + refreshTokenMaxAge),
        }
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: accessTokenMaxAge,
    });


    res
        .status(200)
        .json(new ApiResponse(200, "Login successful"));
});


export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    await prisma.user.update({
        where: {
            id: (req as any).user.id,
        },
        data: {
            refreshToken: null,
            refreshTokenExpiry: null,
        }
    });

    res
        .status(200)
        .json(new ApiResponse(200, "Logout successful"));
});


export const refreshAccessToken = asyncHandler(async (req, res) => {
    const existingRefreshToken = req.cookies.refreshToken;
    if (!existingRefreshToken) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await prisma.user.findFirst({
        where: {
            refreshToken: existingRefreshToken,
        },
    });

    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const { accessToken, refreshToken, accessTokenMaxAge, refreshTokenMaxAge } = generateAccessAndRefreshToken(user.id);

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            refreshToken,
            refreshTokenExpiry: new Date(Date.now() + refreshTokenMaxAge),
        }
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: accessTokenMaxAge,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
    });

    res
        .status(200)
        .json(new ApiResponse(200, "Access token refreshed successfully"));
});


export const getLoggedInUser = asyncHandler(async (req, res) => {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            type: true,
            isEmailVerified: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, "User profile fetched successfully", user));
});