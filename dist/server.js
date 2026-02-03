// src/server.ts
import dotenv from "dotenv";

// src/app.ts
import express16 from "express";
import cors from "cors";

// src/routes/auth.routes.ts
import express from "express";

// src/utils/asyncHandler.ts
var asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
var asyncHandler_default = asyncHandler;

// src/utils/apiError.ts
var ApiError = class extends Error {
  statusCode;
  isOperational;
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/utils/apiResponse.ts
var ApiResponse = class {
  success;
  statusCode;
  message;
  data;
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
  }
};

// src/utils/generateEmailToken.ts
import CryptoJS from "crypto-js";
var generateEmailVerificationToken = () => {
  const randomWordArray = CryptoJS.lib.WordArray.random(32);
  const token = randomWordArray.toString(CryptoJS.enc.Hex);
  const hashedToken = CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
  return { token, hashedToken, expires };
};

// src/utils/sendEmail.ts
import nodemailer from "nodemailer";
var sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  await transporter.sendMail({
    from: `"BazarHub" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
};

// src/controllers/auth.controllers.ts
import bcrypt from "bcryptjs";
import crypto from "crypto";

// src/db/db.ts
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// generated/prisma/client.js
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.2.0",
  "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
  "activeProvider": "mysql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "mysql"\n}\n\nmodel User {\n  id                      String    @id @default(uuid())\n  name                    String?\n  email                   String    @unique\n  password                String\n  provider                Provider  @default(LOCAL)\n  googleId                String?\n  isEmailVerified         Boolean   @default(false)\n  emailVerificationToken  String?\n  emailVerificationExpiry DateTime?\n  role                    Role      @default(USER)\n  type                    Type      @default(RETAIL)\n\n  refreshToken       String?\n  refreshTokenExpiry DateTime?\n  createdAt          DateTime  @default(now())\n\n  // Relations\n  cart       Cart? // One active cart per user\n  orders     Order[] // Order history\n  products   Product[] // Products created by the user\n  employment Employee?\n}\n\nenum Role {\n  ADMIN\n  USER\n}\n\nenum Provider {\n  LOCAL\n  GOOGLE\n}\n\nenum Type {\n  RETAIL\n  WHOLESALE\n}\n\n// 1. Enums help manage state strictly\nenum ProductStatus {\n  DRAFT\n  ACTIVE\n  ARCHIVED\n}\n\nenum OrderStatus {\n  PENDING\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  COMPLETED\n  CANCELLED\n  RETURNED\n  REFUNDED\n  PENDING_REFUND\n  COMPLETED_REFUND\n  CANCELLED_REFUND\n  RETURNED_REFUND\n  REFUNDED_REFUND\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n}\n\nenum Visibility {\n  RETAIL\n  WHOLESALE\n  BOTH\n}\n\nmodel Product {\n  id String @id @default(uuid())\n\n  // Basic Info\n  name_en        String\n  name_bn        String?\n  description_en String  @db.Text // Use Text type for long descriptions\n  description_bn String? @db.Text\n\n  // SEO & Access\n  slug String? @unique\n\n  // Business Logic\n  sku             String?\n  retailPrice     Decimal        @default(0.0) @db.Decimal(10, 2) // Always use Decimal for money\n  wholesalePrice  Decimal?       @db.Decimal(10, 2)\n  stock           Int            @default(0)\n  minWholesaleQty Int            @default(0)\n  status          ProductStatus  @default(DRAFT)\n  isFeatured      Boolean        @default(false)\n  type            Type?\n  // Relations\n  categoryId      String?\n  category        Category?      @relation(fields: [categoryId], references: [id])\n  images          ProductImage[]\n  visibility      Visibility     @default(BOTH)\n  isActive        Boolean        @default(true)\n  isInhouse       Boolean        @default(false)\n  sellerId        String?\n  seller          User?          @relation(fields: [sellerId], references: [id], onDelete: SetNull)\n\n  orders    OrderItem[]\n  cartItems CartItem[]\n\n  // Metadata\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Indexing for performance\n  @@index([categoryId])\n  @@index([status])\n}\n\nmodel ProductImage {\n  id        String  @id @default(uuid())\n  url       String\n  productId String\n  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n}\n\nmodel Category {\n  id String @id @default(uuid())\n\n  // Info\n  name_en     String\n  name_bn     String?\n  slug        String  @unique\n  description String? @db.Text\n  imageUrl    String? // Category thumbnail\n\n  // Hierarchy (Adjacency List Pattern)\n  parentCategoryId String?\n  parentCategory   Category?  @relation("CategoryHierarchy", fields: [parentCategoryId], references: [id], onDelete: SetNull)\n  childCategories  Category[] @relation("CategoryHierarchy")\n\n  // Relations\n  products Product[]\n\n  // Settings\n  sortOrder Int     @default(0)\n  isActive  Boolean @default(true)\n\n  // Metadata\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([parentCategoryId])\n}\n\n// --- Cart System ---\nmodel Cart {\n  id String @id @default(uuid())\n\n  // Can be null if you support "Guest Checkout" (tracked by session/cookie)\n  userId String? @unique\n  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  items CartItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CartItem {\n  id String @id @default(uuid())\n\n  cartId String\n  cart   Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)\n\n  image           String\n  productId       String\n  product         Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n  name            String\n  minWholesaleQty Int\n  retailPrice     Decimal @db.Decimal(10, 2)\n  wholesalePrice  Decimal @db.Decimal(10, 2)\n  quantity        Int     @default(1)\n  buyerType       Type\n\n  // Unique constraint ensures a product appears only once per cart\n  @@unique([cartId, productId])\n}\n\n// --- Order System ---\nmodel Order {\n  id          String @id @default(uuid())\n  orderNumber String @unique // Readable ID like "ORD-2023-1001"\n\n  userId String? // Nullable if user is deleted, but order record remains\n  user   User?   @relation(fields: [userId], references: [id], onDelete: SetNull)\n\n  items OrderItem[]\n\n  // Financials\n  totalAmount Decimal @db.Decimal(10, 2)\n\n  // State Management\n  status        OrderStatus   @default(PENDING)\n  paymentStatus PaymentStatus @default(PENDING)\n\n  // Shipping Details (Ideally linked to an Address model, strictly embedded here for simplicity)\n  shippingAddress ShippingAddress?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel OrderItem {\n  id String @id @default(uuid())\n\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  productId String // Nullable: If product is deleted, we still keep the order history\n  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  // --- SNAPSHOT FIELDS ---\n  // We copy these from Product at the moment of purchase. \n  // If Product price changes later, this record must remain unchanged.\n  name     String\n  price    Decimal @db.Decimal(10, 2)\n  quantity Int\n  sku      String?\n}\n\nmodel ShippingAddress {\n  id         String @id @default(uuid())\n  address    String\n  city       String\n  postalCode String\n  phone      String\n  fullName   String\n\n  orderId String @unique\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n}\n\nmodel BrandLogo {\n  id        String   @id @default(uuid())\n  url       String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Branding {\n  id        String   @id @default(uuid())\n  brandName String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Banner {\n  id        String   @id @default(uuid())\n  title     String\n  imageUrl  String\n  linkUrl   String?\n  position  String\n  sortOrder Int      @default(0)\n  isActive  Boolean  @default(true)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel PaymentGateway {\n  id            String                @id @default(uuid())\n  gateway_id    String\n  name          String                @unique\n  description   String?\n  icon          String\n  is_enabled    Boolean\n  is_configured Boolean\n  config        PaymentGatewayConfig?\n}\n\nmodel PaymentGatewayConfig {\n  api_key          String\n  paymentGatewayId String         @unique\n  paymentGateway   PaymentGateway @relation(fields: [paymentGatewayId], references: [id], onDelete: Cascade)\n}\n\nenum EmployeeRole {\n  MANAGER\n  SUPPORT\n  CONTENT\n  WAREHOUSE\n}\n\nmodel Employee {\n  id         String       @id @default(cuid())\n  userId     String       @unique\n  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  role       EmployeeRole @default(CONTENT)\n  department String\n  isActive   Boolean      @default(false)\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n}\n\nmodel DeliveryPersonnel {\n  id          String  @id @default(uuid())\n  name        String\n  phoneNumber String\n  email       String\n  isActive    Boolean @default(false)\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"Provider"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"isEmailVerified","kind":"scalar","type":"Boolean"},{"name":"emailVerificationToken","kind":"scalar","type":"String"},{"name":"emailVerificationExpiry","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"type","kind":"enum","type":"Type"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"refreshTokenExpiry","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"products","kind":"object","type":"Product","relationName":"ProductToUser"},{"name":"employment","kind":"object","type":"Employee","relationName":"EmployeeToUser"}],"dbName":null},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name_en","kind":"scalar","type":"String"},{"name":"name_bn","kind":"scalar","type":"String"},{"name":"description_en","kind":"scalar","type":"String"},{"name":"description_bn","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"sku","kind":"scalar","type":"String"},{"name":"retailPrice","kind":"scalar","type":"Decimal"},{"name":"wholesalePrice","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"minWholesaleQty","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ProductStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"type","kind":"enum","type":"Type"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductToProductImage"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isInhouse","kind":"scalar","type":"Boolean"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"ProductToUser"},{"name":"orders","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToProduct"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ProductImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductImage"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name_en","kind":"scalar","type":"String"},{"name":"name_bn","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"parentCategoryId","kind":"scalar","type":"String"},{"name":"parentCategory","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"childCategories","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"image","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"CartItemToProduct"},{"name":"name","kind":"scalar","type":"String"},{"name":"minWholesaleQty","kind":"scalar","type":"Int"},{"name":"retailPrice","kind":"scalar","type":"Decimal"},{"name":"wholesalePrice","kind":"scalar","type":"Decimal"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"buyerType","kind":"enum","type":"Type"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"shippingAddress","kind":"object","type":"ShippingAddress","relationName":"OrderToShippingAddress"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"},{"name":"name","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"sku","kind":"scalar","type":"String"}],"dbName":null},"ShippingAddress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToShippingAddress"}],"dbName":null},"BrandLogo":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Branding":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"brandName","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Banner":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"linkUrl","kind":"scalar","type":"String"},{"name":"position","kind":"scalar","type":"String"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"PaymentGateway":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"gateway_id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"is_enabled","kind":"scalar","type":"Boolean"},{"name":"is_configured","kind":"scalar","type":"Boolean"},{"name":"config","kind":"object","type":"PaymentGatewayConfig","relationName":"PaymentGatewayToPaymentGatewayConfig"}],"dbName":null},"PaymentGatewayConfig":{"fields":[{"name":"api_key","kind":"scalar","type":"String"},{"name":"paymentGatewayId","kind":"scalar","type":"String"},{"name":"paymentGateway","kind":"object","type":"PaymentGateway","relationName":"PaymentGatewayToPaymentGatewayConfig"}],"dbName":null},"Employee":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmployeeToUser"},{"name":"role","kind":"enum","type":"EmployeeRole"},{"name":"department","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"DeliveryPersonnel":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.mysql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.mysql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  }
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.js
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/db/db.ts
var adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
});
var prisma = new PrismaClient({ adapter });
var connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
};
var disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("Disconnected from database");
  } catch (error) {
    console.error("Error disconnecting from database", error);
    process.exit(1);
  }
};

// src/controllers/auth.controllers.ts
import { z } from "zod";

// src/utils/generateAccessAndRefreshToken.ts
import jwt from "jsonwebtoken";
var generateAccessAndRefreshToken = (userId) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const ACCESS_TOKEN_EXPIRY = Number(process.env.ACCESS_TOKEN_EXPIRY);
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  const REFRESH_TOKEN_EXPIRY = Number(process.env.REFRESH_TOKEN_EXPIRY);
  const accessTokenMaxAge = ACCESS_TOKEN_EXPIRY * 1e3;
  const refreshTokenMaxAge = REFRESH_TOKEN_EXPIRY * 1e3;
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY
  });
  return { accessToken, refreshToken, accessTokenMaxAge, refreshTokenMaxAge };
};

// src/controllers/auth.controllers.ts
var registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  type: z.enum(["RETAIL", "WHOLESALE"])
});
var register = asyncHandler_default(async (req, res) => {
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
      type
    }
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
  res.status(201).json(
    new ApiResponse(
      201,
      "Registration successful. Please check your email to verify."
    )
  );
});
var verifyEmail = asyncHandler_default(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw new ApiError(400, "Invalid verification token");
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: {
        gt: /* @__PURE__ */ new Date()
      }
    }
  });
  if (!user) {
    throw new ApiError(400, "Token is invalid or expired");
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null
    }
  });
  res.status(200).send(`
            <div>
                <h1 style="text-align: center; color: green; font-size: 36px; font-weight: bold;">Welcome To BazarHub</h1>
                <p style="color: green;text-align: center;padding: 20px;">Email verified successfully!</p>
                <p style="text-align: center; color: green; font-size: 24px; font-weight: bold;">Happy Shopping</p>
                <a href="http://localhost:8080/">Go To BazarHub</a>
            </div>
            `);
});
var loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});
var login = asyncHandler_default(async (req, res) => {
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
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  const { accessToken, refreshToken, accessTokenMaxAge, refreshTokenMaxAge } = generateAccessAndRefreshToken(user.id);
  await prisma.user.update({
    where: {
      id: user.id,
      email: user.email
    },
    data: {
      refreshToken,
      refreshTokenExpiry: new Date(Date.now() + refreshTokenMaxAge)
    }
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: refreshTokenMaxAge
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: accessTokenMaxAge
  });
  res.status(200).json(new ApiResponse(200, "Login successful"));
});
var logout = asyncHandler_default(async (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  await prisma.user.update({
    where: {
      id: req.user.id
    },
    data: {
      refreshToken: null,
      refreshTokenExpiry: null
    }
  });
  res.status(200).json(new ApiResponse(200, "Logout successful"));
});
var refreshAccessToken = asyncHandler_default(async (req, res) => {
  const existingRefreshToken = req.cookies.refreshToken;
  if (!existingRefreshToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const user = await prisma.user.findFirst({
    where: {
      refreshToken: existingRefreshToken
    }
  });
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  const { accessToken, refreshToken, accessTokenMaxAge, refreshTokenMaxAge } = generateAccessAndRefreshToken(user.id);
  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      refreshToken,
      refreshTokenExpiry: new Date(Date.now() + refreshTokenMaxAge)
    }
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: accessTokenMaxAge
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: refreshTokenMaxAge
  });
  res.status(200).json(new ApiResponse(200, "Access token refreshed successfully"));
});
var getLoggedInUser = asyncHandler_default(async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      type: true,
      isEmailVerified: true,
      createdAt: true
    }
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse(200, "User profile fetched successfully", user));
});

// src/middlewares/auth.middleware.ts
import jwt2 from "jsonwebtoken";
var authMiddleware = asyncHandler_default(async (req, res, next) => {
  let accessToken = "";
  if (req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    accessToken = req.headers.authorization.split("Bearer ")[1];
  }
  if (!accessToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const decoded = jwt2.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (decoded.id) {
    req.user = decoded;
    next();
  } else {
    throw new ApiError(401, "Unauthorized");
  }
});

// src/routes/auth.routes.ts
var router = express.Router();
router.route("/register").post(register);
router.route("/verify-email").get(verifyEmail);
router.route("/login").post(login);
router.route("/logout").post(authMiddleware, logout);
router.route("/refresh-token").post(authMiddleware, refreshAccessToken);
router.route("/profile").get(authMiddleware, getLoggedInUser);
var auth_routes_default = router;

// src/routes/upload.routes.ts
import express2 from "express";

// src/middlewares/multer.middleware.ts
import multer from "multer";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename = fileURLToPath2(import.meta.url);
var __dirname = path2.dirname(__filename);
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path2.join(__dirname, "../../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}${path2.extname(file.originalname)}`);
  }
});
var fileFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff|ico)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2,
    // 2MB
    files: 1
    // Maximum number of files
  }
});
var multer_middleware_default = upload;

// src/utils/deleteFile.ts
import path3 from "path";
import fs from "fs";
import { fileURLToPath as fileURLToPath3 } from "url";
var __filename2 = fileURLToPath3(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
var deleteFile = async (fileId) => {
  try {
    const filePath = path3.join(__dirname2, "../../public", "uploads", fileId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    throw error;
  }
};
var deleteFile_default = deleteFile;

// src/controllers/upload.controllers.ts
import { z as z2 } from "zod";
var categoryThumbnail = asyncHandler_default((req, res) => {
  if (req.file) {
    return res.status(200).json(new ApiResponse(200, "File uploaded successfully", { filename: req.file.filename }));
  } else {
    throw new ApiError(400, "File upload failed");
  }
});
var productThumbnail = asyncHandler_default((req, res) => {
  if (req.file) {
    return res.status(200).json(new ApiResponse(200, "File uploaded successfully", { filename: req.file.filename }));
  } else {
    throw new ApiError(400, "File upload failed");
  }
});
var deleteProductThumbnail = asyncHandler_default((req, res) => {
  const { filename } = req.body;
  if (!filename) {
    throw new ApiError(400, "File name is required");
  }
  deleteFile_default(filename);
  return res.status(200).json(new ApiResponse(200, "File deleted successfully"));
});
var createBrandingLogo = asyncHandler_default((req, res) => {
  if (req.file) {
    return res.status(200).json(new ApiResponse(200, "Uploaded branding logo successfully", { filename: req.file.filename }));
  } else {
    throw new ApiError(400, "File upload failed");
  }
});
var createBannerImage = asyncHandler_default((req, res) => {
  if (req.file) {
    return res.status(200).json(new ApiResponse(200, "Uploaded banner image successfully", { filename: req.file.filename }));
  } else {
    throw new ApiError(400, "File upload failed");
  }
});
var DeleteBannerImageSchema = z2.object({
  bannerImageUrl: z2.string()
});
var deleteBannerImage = asyncHandler_default(async (req, res) => {
  const validation = DeleteBannerImageSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { bannerImageUrl } = validation.data;
  const path6 = bannerImageUrl.split("/uploads/");
  const fileId = path6[path6.length - 1];
  deleteFile_default(fileId || "");
  return res.status(200).json(new ApiResponse(200, "Deleted banner image successfully", { bannerImageUrl }));
});

// src/routes/upload.routes.ts
var router2 = express2.Router();
router2.route("/category-thumbnail").post(authMiddleware, async (req, res, next) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
    throw new ApiError(403, "Unauthorized");
  }
  next();
}, multer_middleware_default.single("category-thumbnail"), categoryThumbnail);
router2.route("/product-thumbnail").post(authMiddleware, async (req, res, next) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
    throw new ApiError(403, "Unauthorized");
  }
  next();
}, multer_middleware_default.single("product-thumbnail"), productThumbnail);
router2.route("/product-thumbnail").delete(authMiddleware, async (req, res, next) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
    throw new ApiError(403, "Unauthorized");
  }
  next();
}, deleteProductThumbnail);
router2.route("/branding-logo").post(authMiddleware, async (req, res, next) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(403, "Unauthorized");
  }
  next();
}, multer_middleware_default.single("branding-logo"), createBrandingLogo);
router2.route("/banner-image").post(authMiddleware, async (req, res, next) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
    throw new ApiError(403, "Unauthorized");
  }
  next();
}, multer_middleware_default.single("banner-image"), createBannerImage);
router2.route("/banner-image").delete(authMiddleware, async (req, res, next) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
    throw new ApiError(403, "Unauthorized");
  }
  next();
}, deleteBannerImage);
var upload_routes_default = router2;

// src/routes/delete.routes.ts
import express3 from "express";

// src/controllers/delete.controllers.ts
import fs2 from "fs";
import path4 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
var __filename3 = fileURLToPath4(import.meta.url);
var __dirname3 = path4.dirname(__filename3);
var deleteCategoryThumbnail = asyncHandler_default(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
    throw new ApiError(403, "Unauthorized");
  }
  const { filename } = req.body;
  if (!filename) {
    throw new ApiError(400, "Filename is required");
  }
  const filePath = path4.join(__dirname3, "../../public/uploads", filename);
  if (!fs2.existsSync(filePath)) {
    throw new ApiError(404, "File not found");
  }
  fs2.unlink(filePath, (err) => {
    if (err) {
      throw new ApiError(500, "Failed to delete file");
    } else {
      res.status(200).json(new ApiResponse(200, "File deleted successfully"));
    }
  });
});

// src/routes/delete.routes.ts
var router3 = express3.Router();
router3.route("/category-thumbnail").delete(authMiddleware, deleteCategoryThumbnail);
var delete_routes_default = router3;

// src/routes/category.routes.ts
import express4 from "express";

// src/controllers/category.controllers.ts
import { z as z3 } from "zod";
var CreateCategorySchema = z3.object({
  name_en: z3.string().min(3, "Category name must be at least 3 characters long"),
  name_bn: z3.string().nullable(),
  slug: z3.string(),
  imageUrl: z3.string().url("Invalid URL"),
  parentCategoryId: z3.string().nullable(),
  sortOrder: z3.number().nullable(),
  isActive: z3.boolean().nullable()
});
var createCategory = asyncHandler_default(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
      slug
    }
  });
  return res.status(201).json(new ApiResponse(201, "Category created successfully", category));
});
var UpdateCategorySchema = z3.object({
  categoryId: z3.string(),
  name_en: z3.string().min(3, "Category name must be at least 3 characters long"),
  name_bn: z3.string().nullable(),
  slug: z3.string(),
  imageUrl: z3.string().url("Invalid URL"),
  parentCategoryId: z3.string().nullable(),
  sortOrder: z3.number().nullable(),
  isActive: z3.boolean().nullable()
});
var updateCategory = asyncHandler_default(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
      slug
    }
  });
  return res.status(200).json(new ApiResponse(200, "Category updated successfully", category));
});
var DeleteCategorySchema = z3.object({
  categoryId: z3.string()
});
var deleteCategory = asyncHandler_default(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
    await deleteFile_default(imageId);
  }
  return res.status(200).json(new ApiResponse(200, "Category deleted successfully", category));
});
var BulkDeleteCategoriesSchema = z3.object({
  categoryIds: z3.array(z3.string())
});
var bulkDeleteCategories = asyncHandler_default(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
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
      await deleteFile_default(imageId);
    }
  }
  return res.status(200).json(new ApiResponse(200, "Category deleted successfully", categoryIds));
});
var GetCategorySchema = z3.object({
  categoryId: z3.string()
});
var getCategory = asyncHandler_default(async (req, res) => {
  const { categoryId } = GetCategorySchema.parse(req.body);
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });
  return res.status(200).json(new ApiResponse(200, "Category fetched successfully", category));
});
var getAllCategories = asyncHandler_default(async (req, res) => {
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

// src/routes/category.routes.ts
var router4 = express4.Router();
router4.route("/create-category").post(authMiddleware, createCategory);
router4.route("/update-category").put(authMiddleware, updateCategory);
router4.route("/delete-category").delete(authMiddleware, deleteCategory);
router4.route("/bulk-delete-categories").delete(authMiddleware, bulkDeleteCategories);
router4.route("/get-category").get(getCategory);
router4.route("/get-all-categories").get(getAllCategories);
var category_routes_default = router4;

// src/routes/product.routes.ts
import express5 from "express";

// src/controllers/product.controllers.ts
import { z as z4 } from "zod";
var CreateProductSchema = z4.object({
  name_en: z4.string().min(3, "Name must be at least 3 characters long"),
  name_bn: z4.string(),
  description_en: z4.string(),
  description_bn: z4.string(),
  categoryId: z4.string(),
  retailPrice: z4.number(),
  wholesalePrice: z4.number(),
  stock: z4.number(),
  minWholesaleQty: z4.number(),
  sku: z4.string(),
  visibility: z4.string(),
  images: z4.array(z4.string()),
  isActive: z4.boolean(),
  isInhouse: z4.boolean(),
  sellerId: z4.string().nullable(),
  slug: z4.string().optional()
});
var createProduct = asyncHandler_default(async (req, res) => {
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
      isInhouse
    }
  });
  const productImages = await prisma.productImage.createMany({
    data: images.map((image) => ({
      productId: product.id,
      url: image
    }))
  });
  return res.status(201).json(new ApiResponse(201, "Product created successfully", product));
});
var getProducts = asyncHandler_default(async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      category: {
        select: {
          name_en: true,
          name_bn: true
        }
      }
    }
  });
  return res.status(200).json(new ApiResponse(200, "Products fetched successfully", products));
});
var deleteProduct = asyncHandler_default(async (req, res) => {
  const { productId } = req.body;
  const images = await prisma.productImage.findMany({
    where: {
      productId
    },
    select: {
      url: true
    }
  });
  const product = await prisma.product.delete({
    where: {
      id: productId
    }
  });
  for (const image of images) {
    const fileId = image.url.split("/uploads/").pop();
    await deleteFile_default(fileId);
  }
  return res.status(200).json(new ApiResponse(200, "Product deleted successfully", product));
});
var updateProduct = asyncHandler_default(async (req, res) => {
  const { productId, updateData } = req.body;
  const productExists = await prisma.product.findUnique({
    where: {
      id: productId
    }
  });
  if (!productExists) {
    throw new ApiError(404, "Product not found");
  }
  const ExistedImages = await prisma.productImage.findMany({
    where: {
      productId
    },
    select: {
      url: true
    }
  });
  for (const image of ExistedImages) {
    const imageUrl = image.url;
    for (const img of updateData.images) {
      if (imageUrl === img) {
        continue;
      }
      const fileId = img.split("/uploads/").pop();
      await deleteFile_default(fileId);
    }
  }
  await prisma.productImage.deleteMany({
    where: {
      productId
    }
  });
  const { images, categoryId, ...restUpdateData } = updateData;
  const product = await prisma.product.update({
    where: {
      id: productId
    },
    data: {
      ...restUpdateData,
      categoryId: categoryId || null,
      images: {
        create: images.map((image) => ({
          url: image
        }))
      }
    }
  });
  return res.status(200).json(new ApiResponse(200, "Product updated successfully", product));
});

// src/routes/product.routes.ts
var router5 = express5.Router();
router5.route("/create-product").post(authMiddleware, async (req, res, next) => {
  const id = req.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(403, "Unauthorized");
  }
  next();
}, createProduct);
router5.route("/delete-product").delete(authMiddleware, async (req, res, next) => {
  const id = req.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(403, "Unauthorized");
  }
  next();
}, deleteProduct);
router5.route("/update-product").put(authMiddleware, async (req, res, next) => {
  const id = req.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(403, "Unauthorized");
  }
  next();
}, updateProduct);
router5.route("/get-products").get(getProducts);
var product_routes_default = router5;

// src/routes/stats.routes.ts
import express6 from "express";

// src/controllers/stats.controllers.ts
var getDashboardStats = asyncHandler_default(async (req, res) => {
  const totalBanners = await prisma.banner.count();
  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();
  const totalCustomers = await prisma.user.count({
    where: {
      role: "USER"
    }
  });
  const totalRetailCustomers = await prisma.user.count({
    where: {
      type: "RETAIL",
      role: "USER"
    }
  });
  const totalWholesaleCustomers = await prisma.user.count({
    where: {
      type: "WHOLESALE",
      role: "USER"
    }
  });
  const totalOrders = await prisma.order.count();
  const recentOrders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 10,
    include: {
      items: true,
      user: {
        select: {
          id: true,
          type: true
        }
      }
    }
  });
  const totalPendingOrders = await prisma.order.count({
    where: {
      status: "PENDING"
    }
  });
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalAmount: true
    }
  });
  const totalCompletedOrders = await prisma.order.count({
    where: {
      status: "COMPLETED"
    }
  });
  const totalCancelledOrders = await prisma.order.count({
    where: {
      status: "CANCELLED"
    }
  });
  const totalReturnedOrders = await prisma.order.count({
    where: {
      status: "RETURNED"
    }
  });
  const totalRefundedOrders = await prisma.order.count({
    where: {
      status: "REFUNDED"
    }
  });
  const totalPendingRefundOrders = await prisma.order.count({
    where: {
      status: "PENDING_REFUND"
    }
  });
  const totalCompletedRefundOrders = await prisma.order.count({
    where: {
      status: "COMPLETED_REFUND"
    }
  });
  const totalCancelledRefundOrders = await prisma.order.count({
    where: {
      status: "CANCELLED_REFUND"
    }
  });
  const totalReturnedRefundOrders = await prisma.order.count({
    where: {
      status: "RETURNED_REFUND"
    }
  });
  const totalRefundedRefundOrders = await prisma.order.count({
    where: {
      status: "REFUNDED_REFUND"
    }
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
      }
    )
  );
});

// src/routes/stats.routes.ts
var router6 = express6.Router();
router6.route("/dashboard").get(authMiddleware, async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
      throw new ApiError(403, "Unauthorized");
    }
    next();
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Internal server error", error));
  }
}, getDashboardStats);
var stats_routes_default = router6;

// src/routes/cart.routes.ts
import express7 from "express";

// src/controllers/cart.controllers.ts
var addToCart = asyncHandler_default(async (req, res) => {
  const { productId, quantity } = req.body;
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "User not found");
  }
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  const existCart = await prisma.cart.findUnique({
    where: {
      userId: id
    }
  });
  let cart = null;
  if (!existCart) {
    cart = await prisma.cart.create({
      data: {
        userId: id
      }
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
        productId
      }
    }
  });
  if (existCartItem) {
    await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      },
      data: {
        quantity
      }
    });
    return res.status(200).json(new ApiResponse(200, "Product updated in cart"));
  }
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    },
    include: {
      images: true
    }
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
      wholesalePrice: product.wholesalePrice || 0
    }
  });
  return res.status(200).json(new ApiResponse(200, "Product added to cart"));
});
var getCartItems = asyncHandler_default(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(400, "Unauthorized access");
  }
  const cart = await prisma.cart.findUnique({
    where: {
      userId: id
    },
    select: {
      items: true,
      id: true
    }
  });
  res.status(200).json(new ApiResponse(200, "Suceessfully find cart", cart));
});
var removeCartItem = asyncHandler_default(async (req, res) => {
  const { productId } = req.body;
  const id = req.user.id;
  if (!productId) {
    throw new ApiError(400, "Product id is required");
  }
  if (!id) {
    throw new ApiError(400, "Unauthorized access");
  }
  const cart = await prisma.cart.findUnique({
    where: {
      userId: id
    },
    select: {
      items: true,
      id: true
    }
  });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });
  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }
  await prisma.cartItem.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });
  res.status(200).json(new ApiResponse(200, "Suceessfully removed cart item", item));
});
var updateCartItemQuantity = asyncHandler_default(async (req, res) => {
  const { productId, quantity } = req.body;
  const id = req.user.id;
  if (!productId) {
    throw new ApiError(400, "Product id is required");
  }
  if (!id) {
    throw new ApiError(400, "Unauthorized access");
  }
  const cart = await prisma.cart.findUnique({
    where: {
      userId: id
    },
    select: {
      items: true,
      id: true
    }
  });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });
  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }
  await prisma.cartItem.update({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    },
    data: {
      quantity
    }
  });
  return res.status(200).json(new ApiResponse(200, "Suceessfully updated cart item quantity", item));
});
var clearCart = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  const cart = await prisma.cart.delete({
    where: {
      userId: user.id
    }
  });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  return res.status(200).json(new ApiResponse(200, "Cart is clear", { cart }));
});

// src/routes/cart.routes.ts
var router7 = express7.Router();
router7.route("/").get(authMiddleware, getCartItems);
router7.route("/add").post(authMiddleware, addToCart);
router7.route("/remove").post(authMiddleware, removeCartItem);
router7.route("/update").post(authMiddleware, updateCartItemQuantity);
router7.route("/clear").delete(authMiddleware, clearCart);
var cart_routes_default = router7;

// src/routes/order.routes.ts
import express8 from "express";

// src/controllers/order.controllers.ts
import { z as z5 } from "zod";
var addressSchema = z5.object({
  fullName: z5.string().min(3, "Full name is required"),
  phone: z5.string().min(10, "Phone is required"),
  address: z5.string().min(5, "Address is required"),
  city: z5.string().min(3, "City is required"),
  postalCode: z5.string().min(4, "Postal code is required")
});
var orderItemsSchema = z5.array(z5.object({
  productId: z5.string().min(1, "Product ID is required")
}));
var CreateOrderSchema = z5.object({
  shippingAddress: addressSchema,
  orderItems: orderItemsSchema
});
var createOrder = asyncHandler_default(async (req, res) => {
  const { shippingAddress, orderItems } = req.body;
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const id = req.user.id;
  console.log(id);
  if (!id) {
    throw new ApiError(401, "Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: {
      id
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
      cartId: cart.id
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
          price: item.retailPrice
        }))
      }
    }
  });
  return res.status(200).json(new ApiResponse(200, "Order created successfully", { order }));
});
var createCODOrder = asyncHandler_default(async (req, res) => {
  const { shippingAddress, orderItems } = req.body;
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: {
      id
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
      cartId: cart.id
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
          price: item.retailPrice
        }))
      }
    }
  });
  return res.status(200).json(new ApiResponse(200, "Order created successfully", { order }));
});
var getOrders = asyncHandler_default(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(401, "Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const orders = await prisma.order.findMany({
    where: {
      userId: id
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      },
      shippingAddress: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return res.status(200).json(new ApiResponse(200, "Orders found", { orders }));
});
var getAllOrders = asyncHandler_default(async (req, res) => {
  const id = req.user.id;
  const status = req.query.status;
  if (!id) {
    throw new ApiError(401, "Unauthorized access");
  }
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new ApiError(401, "Unauthorized access");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const orders = await prisma.order.findMany({
    where: {
      status
    },
    include: {
      user: {
        select: {
          type: true
        }
      }
    }
  });
  res.status(200).json(new ApiResponse(200, "Successfully fetched order", { orders }));
});

// src/routes/order.routes.ts
var router8 = express8.Router();
router8.route("/create-order").post(authMiddleware, createOrder);
router8.route("/create-cod-order").post(authMiddleware, createCODOrder);
router8.route("/get-all-orders").get(authMiddleware, getAllOrders);
router8.route("/get-orders").get(authMiddleware, getOrders);
var order_routes_default = router8;

// src/routes/payment.routes.ts
import express9 from "express";

// src/services/flexpay.service.ts
import axios from "axios";
var FLEXPAY_BASE_URL = "https://pay.flexpaybd.com/api/payment";
var createFlexPayPayment = async (payload) => {
  let data = JSON.stringify({
    "success_url": payload.success_url,
    "cancel_url": payload.cancel_url,
    "metadata": payload.meta_data,
    "amount": payload.amount
  });
  const paymentGateway = await prisma.paymentGateway.findUnique({
    where: {
      name: "flexpay"
    },
    include: {
      config: true
    }
  });
  if (!paymentGateway) {
    throw new ApiError(400, "Invalid api key");
  }
  const apiKey = paymentGateway?.config?.api_key;
  if (!apiKey) {
    throw new ApiError(400, "Invalid api key");
  }
  console.log(apiKey);
  let config2 = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${FLEXPAY_BASE_URL}/create`,
    headers: {
      "API-KEY": apiKey || process.env.FLEXPAY_BRAND_KEY,
      "Content-Type": "application/json"
    },
    data
  };
  const res = await axios(config2);
  return res.data;
};
var verifyFlexPayPayment = async (transactionId) => {
  const paymentGateway = await prisma.paymentGateway.findUnique({
    where: {
      name: "flexpay"
    },
    include: {
      config: true
    }
  });
  if (!paymentGateway) {
    throw new ApiError(400, "Invalid api key");
  }
  const apiKey = paymentGateway?.config?.api_key;
  let data = JSON.stringify({ "transaction_id": transactionId });
  let config2 = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${FLEXPAY_BASE_URL}/verify`,
    headers: {
      "API-KEY": apiKey || process.env.FLEXPAY_BRAND_KEY,
      "Content-Type": "application/json"
    },
    data
  };
  const res = await axios(config2);
  return res.data;
};

// src/controllers/payment.controllers.ts
import { z as z6 } from "zod";
var InitiatePaymentSchema = z6.object({
  name: z6.string(),
  orderId: z6.string()
});
var initiatePayment = asyncHandler_default(async (req, res) => {
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
  const validation = InitiatePaymentSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { name, orderId } = validation.data;
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: user.id
    }
  });
  if (!order) {
    throw new ApiError(404, "Order is not placed");
  }
  console.log(order.totalAmount);
  const totalAmount = parseInt(order.totalAmount.toString());
  const payment = await createFlexPayPayment({
    cus_name: name,
    cus_email: user.email,
    amount: totalAmount,
    success_url: process.env.FRONTEND_SUCCESS_URL,
    cancel_url: process.env.FRONTEND_CANCEL_URL,
    meta_data: { orderId }
  });
  if (!payment.status) {
    throw new ApiError(500, payment.message || "Payment gateway error!");
  }
  return res.status(200).json(new ApiResponse(200, "Payment initiated successfully", { paymentUrl: payment.payment_url, orderId }));
});
var verifyPayment = asyncHandler_default(async (req, res) => {
  const { transactionId } = req.query;
  if (!transactionId || typeof transactionId !== "string") {
    return res.status(400).json({ message: "Invalid transaction id" });
  }
  const verification = await verifyFlexPayPayment(transactionId);
  if (!verification.status) {
    throw new ApiError(400, "Something went wrong");
  }
  const orderId = verification.metadata.orderId;
  if (!orderId) {
    throw new ApiError(400, "Something went wrong");
  }
  const order = await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      paymentStatus: "PAID"
    }
  });
  if (!order) {
    throw new ApiError(400, "Something went wrong");
  }
  const deletedCart = await prisma.cart.findUnique({
    where: {
      userId: order.userId
    }
  });
  if (!deletedCart) {
  }
  return res.status(200).json(new ApiResponse(200, "Payment made and order updated successfully", { verification, order }));
});

// src/routes/payment.routes.ts
var router9 = express9.Router();
router9.route("/create").post(authMiddleware, initiatePayment);
router9.route("/verify").post(authMiddleware, verifyPayment);
var payment_routes_default = router9;

// src/routes/paymentGateway.routes.ts
import express10 from "express";

// src/controllers/paymentGateway.controllers.ts
import { z as z7 } from "zod";
var AddPaymentGatewaySchema = z7.object({
  gateway_id: z7.string(),
  name: z7.string(),
  description: z7.string(),
  icon: z7.string(),
  is_enabled: z7.boolean(),
  is_configured: z7.boolean(),
  config: z7.object({
    api_key: z7.string()
  })
});
var addPaymentGateway = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const validation = AddPaymentGatewaySchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { gateway_id, name, description, icon, config: config2, is_configured, is_enabled } = validation.data;
  const newPaymentGateway = await prisma.paymentGateway.create({
    data: {
      gateway_id,
      name,
      description,
      icon,
      config: {
        create: {
          api_key: config2.api_key
        }
      },
      is_configured,
      is_enabled
    }
  });
  if (!newPaymentGateway) {
    throw new ApiError(500, "Internal server error creating payment gateway");
  }
  return res.status(201).json(new ApiResponse(200, "Created payment gateway successfully", { paymentGateway: { ...newPaymentGateway, config: { api_key: config2.api_key } } }));
});
var UpdatePaymentGatewaySchema = z7.object({
  id: z7.string(),
  gateway_id: z7.string(),
  name: z7.string(),
  description: z7.string(),
  icon: z7.string(),
  is_enabled: z7.boolean(),
  is_configured: z7.boolean(),
  config: z7.object({
    api_key: z7.string()
  })
});
var updatePaymetGateway = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const validation = UpdatePaymentGatewaySchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { id: paymentGatewayId, config: config2, ...updates } = validation.data;
  const existedPaymentGateway = await prisma.paymentGateway.findUnique({
    where: {
      id: paymentGatewayId
    }
  });
  if (!existedPaymentGateway) {
    throw new ApiError(404, "Payment gateway not found");
  }
  const updatedPaymentGateWay = await prisma.paymentGateway.update({
    where: {
      id: paymentGatewayId
    },
    data: {
      ...updates,
      config: {
        update: {
          api_key: config2.api_key
        }
      }
    },
    include: {
      config: true
    }
  });
  if (!updatedPaymentGateWay) {
    throw new ApiError(500, "Internal server error updating payment gateway");
  }
  return res.status(200).json(new ApiResponse(200, "Updated payment gateway successfully", { paymentGateway: updatedPaymentGateWay }));
});
var getPaymetGateways = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const existedPaymentGateways = await prisma.paymentGateway.findMany({
    include: {
      config: true
    }
  });
  return res.status(200).json(new ApiResponse(200, "Fetched payment gateways", { paymentGateways: existedPaymentGateways }));
});
var getPaymetGatewaysClient = asyncHandler_default(async (req, res) => {
  const existedPaymentGateways = await prisma.paymentGateway.findMany();
  return res.status(200).json(new ApiResponse(200, "Fetched payment gateways", { paymentGateways: existedPaymentGateways }));
});
var DeletePaymentGatewaySchema = z7.object({
  id: z7.string()
});
var deletePaymentGateway = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const validation = DeletePaymentGatewaySchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { id: gatewayId } = validation.data;
  const existedPaymentGateway = await prisma.paymentGateway.findUnique({
    where: {
      id: gatewayId
    }
  });
  if (!existedPaymentGateway) {
    throw new ApiError(404, "Payment gateway not found");
  }
  const deletedPaymentGateway = await prisma.paymentGateway.delete({
    where: {
      id: existedPaymentGateway.id
    }
  });
  if (!deletedPaymentGateway) {
    throw new ApiError(500, "Internal server error deleting payment gateway");
  }
  return res.status(200).json(new ApiResponse(200, "Deleted payment gateway successfully", { paymentGateway: deletedPaymentGateway }));
});

// src/routes/paymentGateway.routes.ts
var router10 = express10.Router();
router10.route("/add-gateway").post(authMiddleware, addPaymentGateway);
router10.route("/update-gateway").put(authMiddleware, updatePaymetGateway);
router10.route("/delete-gateway").delete(authMiddleware, deletePaymentGateway);
router10.route("/").get(authMiddleware, getPaymetGateways);
router10.route("/client").get(authMiddleware, getPaymetGatewaysClient);
var paymentGateway_routes_default = router10;

// src/routes/customers.routes.ts
import express11 from "express";

// src/controllers/customer.controllers.ts
import { z as z8 } from "zod";
var getCustomers = asyncHandler_default(async (req, res) => {
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
          id: true
        }
      }
    }
  });
  return res.status(200).json(new ApiResponse(200, "Successfully fetched customers data", { customers }));
});
var UpdateCustomerSchema = z8.object({
  customerId: z8.string(),
  customerType: z8.string()
});
var updateCustomerType = asyncHandler_default(async (req, res) => {
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
        not: "ADMIN"
      }
    }
  });
  if (!customer) {
    throw new ApiError(404, "Customer is not found");
  }
  const updatedCustomer = await prisma.user.update({
    where: {
      id: customerId
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

// src/routes/customers.routes.ts
var router11 = express11.Router();
router11.route("/").get(authMiddleware, getCustomers);
router11.route("/update-type").post(authMiddleware, updateCustomerType);
var customers_routes_default = router11;

// src/routes/employee.routes.ts
import express12 from "express";

// src/controllers/employee.controllers.ts
import { z as z9 } from "zod";
var AddEmployeeSchema = z9.object({
  userId: z9.string(),
  role: z9.string(),
  department: z9.string(),
  isActive: z9.boolean().optional()
});
var addEmployee = asyncHandler_default(async (req, res) => {
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
  const validation = AddEmployeeSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { userId, isActive, department, role } = validation.data;
  const userOfEmployee = await prisma.user.findUnique({
    where: {
      id: userId
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
      role: role === "MANAGER" ? "MANAGER" : role === "SUPPORT" ? "SUPPORT" : role === "WAREHOUSE" ? "WAREHOUSE" : "CONTENT",
      department,
      isActive: isActive ? isActive : false
    }
  });
  if (!newEmployee) {
    throw new ApiError(500, "Internal server error creating employee");
  }
  return res.status(201).json(new ApiResponse(201, "Added employee successfully", { employee: newEmployee }));
});
var getEmployees = asyncHandler_default(async (req, res) => {
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
  const allEmployees = await prisma.employee.findMany();
  return res.status(200).json(new ApiResponse(200, "Fetched employees data", { employees: allEmployees }));
});
var UpdateEmployeeSchema = z9.object({
  id: z9.string(),
  userId: z9.string(),
  role: z9.string(),
  department: z9.string(),
  isActive: z9.boolean().optional()
});
var updateEmployee = asyncHandler_default(async (req, res) => {
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
  const validation = UpdateEmployeeSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { id: employeeId, userId, isActive, department, role } = validation.data;
  const userOfEmployee = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!userOfEmployee) {
    throw new ApiError(400, "Invalid user UUID");
  }
  const existedEmployee = await prisma.employee.findUnique({
    where: {
      id: employeeId
    }
  });
  if (!existedEmployee) {
    throw new ApiError(404, "Employee not found");
  }
  const updatedEmployee = await prisma.employee.update({
    where: {
      id: employeeId
    },
    data: {
      userId,
      role: role === "MANAGER" ? "MANAGER" : role === "SUPPORT" ? "SUPPORT" : role === "WAREHOUSE" ? "WAREHOUSE" : "CONTENT",
      isActive: isActive ? isActive : false,
      department
    }
  });
  if (!updatedEmployee) {
    throw new ApiError(500, "Internal server error updating employee");
  }
  return res.status(200).json(new ApiResponse(200, "Updated employee successfully", { employee: updatedEmployee }));
});
var DeleteEmployeeSchema = z9.object({
  employeeId: z9.string()
});
var deleteEmployee = asyncHandler_default(async (req, res) => {
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
  const validation = DeleteEmployeeSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { employeeId } = validation.data;
  const existedEmployee = await prisma.employee.findUnique({
    where: {
      id: employeeId
    }
  });
  if (!existedEmployee) {
    throw new ApiError(404, "Employee not found");
  }
  const deletedEmployee = await prisma.employee.delete({
    where: {
      id: employeeId
    }
  });
  if (!deletedEmployee) {
    throw new ApiError(500, "Internal server error deleting employee");
  }
  return res.status(200).json(new ApiResponse(200, "Deleted employee successfully", { employee: deletedEmployee }));
});

// src/routes/employee.routes.ts
var router12 = express12.Router();
router12.route("/").get(authMiddleware, getEmployees);
router12.route("/add-employee").post(authMiddleware, addEmployee);
router12.route("/update-employee").put(authMiddleware, updateEmployee);
router12.route("/delete-employee").delete(authMiddleware, deleteEmployee);
var employee_routes_default = router12;

// src/routes/deliveryPersonnel.routes.ts
import express13 from "express";

// src/controllers/deliveryPersonnel.controllers.ts
import { z as z10 } from "zod";
var AddDeliveryPersonnelSchema = z10.object({
  name: z10.string(),
  phoneNumber: z10.string(),
  email: z10.string(),
  isActive: z10.boolean()
});
var addDeliveryPersonnel = asyncHandler_default(async (req, res) => {
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
  const validation = AddDeliveryPersonnelSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { name, email, phoneNumber, isActive } = validation.data;
  const deliveryPersonnel = await prisma.deliveryPersonnel.create({
    data: {
      name,
      email,
      phoneNumber,
      isActive
    }
  });
  if (!deliveryPersonnel) {
    throw new ApiError(500, "Internal server error creating delivery personnel");
  }
  return res.status(201).json(new ApiResponse(201, "Added delivery personnel successfully", { deliveryPersonnel }));
});
var getDeliveryPersonnels = asyncHandler_default(async (req, res) => {
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
  const deliveryPersonnels = await prisma.deliveryPersonnel.findMany();
  return res.status(200).json(new ApiResponse(200, "Fetched delivery personnels", { deliveryPersonnels }));
});
var UpdateDeliveryPersonnelSchema = z10.object({
  id: z10.string(),
  name: z10.string(),
  phoneNumber: z10.string(),
  email: z10.string(),
  isActive: z10.boolean()
});
var updateDeliveryPersonnel = asyncHandler_default(async (req, res) => {
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
  const validation = UpdateDeliveryPersonnelSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { id: deliveryPersonnelId, name, email, phoneNumber, isActive } = validation.data;
  const existedDeliveryPersonnel = await prisma.deliveryPersonnel.findUnique({
    where: {
      id: deliveryPersonnelId
    }
  });
  if (!existedDeliveryPersonnel) {
    throw new ApiError(404, "Delivery personnel not found");
  }
  const updatedDeliveryPersonnel = await prisma.deliveryPersonnel.update({
    where: {
      id: deliveryPersonnelId
    },
    data: {
      name,
      email,
      phoneNumber,
      isActive
    }
  });
  if (!updatedDeliveryPersonnel) {
    throw new ApiError(500, "Internal server error updating delivery personnel");
  }
  return res.status(200).json(new ApiResponse(200, "Updated delivery personnel successfully", { deliveryPersonnel: updatedDeliveryPersonnel }));
});
var DeleteDeliveryPersonnelSchema = z10.object({
  id: z10.string()
});
var deleteDeliveryPersonnel = asyncHandler_default(async (req, res) => {
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
  const validation = DeleteDeliveryPersonnelSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { id: deliveryPersonnelId } = validation.data;
  const existedDeliveryPersonnel = await prisma.deliveryPersonnel.findUnique({
    where: {
      id: deliveryPersonnelId
    }
  });
  if (!existedDeliveryPersonnel) {
    throw new ApiError(404, "Delivery personnel not found");
  }
  const deletedDeliveryPersonnel = await prisma.deliveryPersonnel.delete({
    where: {
      id: deliveryPersonnelId
    }
  });
  if (!deletedDeliveryPersonnel) {
    throw new ApiError(500, "Internal server error deleting delivery personnel");
  }
  return res.status(200).json(new ApiResponse(200, "Deleted delivery personnel successfully", { deliveryPersonnel: deletedDeliveryPersonnel }));
});

// src/routes/deliveryPersonnel.routes.ts
var router13 = express13.Router();
router13.route("/personnel").get(authMiddleware, getDeliveryPersonnels);
router13.route("/add-personnel").post(authMiddleware, addDeliveryPersonnel);
router13.route("/update-personnel").put(authMiddleware, updateDeliveryPersonnel);
router13.route("/delete-personnel").delete(authMiddleware, deleteDeliveryPersonnel);
var deliveryPersonnel_routes_default = router13;

// src/routes/branding.routes.ts
import express14 from "express";

// src/controllers/branding.controllers.ts
import { z as z11 } from "zod";
var UpdateBrandingSchema = z11.object({
  brandName: z11.string()
});
var updateBranding = asyncHandler_default(async (req, res) => {
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
        id: brandingId
      },
      data: { brandName }
    });
    if (!updatedBranding) {
      throw new ApiError(500, "Internal server error updating braning");
    }
    return res.status(200).json(new ApiResponse(200, "Updated branding name successfully", { brandName }));
  }
  const newBranding = await prisma.branding.create({
    data: {
      brandName
    }
  });
  if (!newBranding) {
    throw new ApiError(500, "Internal server error creating branding");
  }
  return res.status(201).json(new ApiResponse(201, "Created branding name successfully", { brandName }));
});
var UpdateBraningLogoSchema = z11.object({
  brandLogoUrl: z11.string()
});
var updateBrandingLogo = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const validation = UpdateBraningLogoSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { brandLogoUrl } = validation.data;
  const existingBrandLogos = await prisma.brandLogo.findMany();
  if (existingBrandLogos.length) {
    const brandLogoId = existingBrandLogos[0]?.id;
    if (!brandLogoId) {
      throw new ApiError(500, "Internal server error no brand logo id found");
    }
    const updatedBrandLogo = await prisma.brandLogo.update({
      where: {
        id: brandLogoId
      },
      data: {
        url: brandLogoUrl
      }
    });
    if (!updatedBrandLogo) {
      throw new ApiError(500, "Internal server error updating brand logo");
    }
    return res.status(200).json(new ApiResponse(200, "Brand logo updated successfully", { brandLogoUrl: updatedBrandLogo.url }));
  }
  const newBrandLogo = await prisma.brandLogo.create({
    data: { url: brandLogoUrl }
  });
  if (!newBrandLogo) {
    throw new ApiError(500, "Internel server error creating brand logo");
  }
  return res.status(201).json(new ApiResponse(201, "Created brand logo successfully", { brandLogoUrl }));
});
var DeleteBrandingLogoSchema = z11.object({
  brandLogoUrl: z11.string()
});
var deleteBrandingLogo = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const validation = DeleteBrandingLogoSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { brandLogoUrl } = validation.data;
  const existingBrandLogos = await prisma.brandLogo.findMany();
  let existingBrandLogoUrl = "";
  let existingBrandLogoId = "";
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
  const path6 = brandLogoUrl.split("/uploads/");
  const fileId = path6[path6.length - 1];
  deleteFile_default(fileId || "");
  await prisma.brandLogo.delete({
    where: {
      id: existingBrandLogoId
    }
  });
  return res.status(200).json(new ApiResponse(200, "Deleted brand logo successfully", { brandLogoUrl }));
});
var getBranding = asyncHandler_default(async (req, res) => {
  const brandLogos = await prisma.brandLogo.findMany();
  let brandLogoUrl = "";
  if (brandLogos.length) {
    brandLogoUrl = brandLogos[0]?.url || "";
  }
  const brandings = await prisma.branding.findMany();
  let brandName = "";
  if (brandings.length) {
    brandName = brandings[0]?.brandName || "";
  }
  return res.status(200).json(new ApiResponse(200, "Fetched branding successfully", { brandLogoUrl, brandName }));
});

// src/routes/branding.routes.ts
var router14 = express14.Router();
router14.route("/").get(getBranding);
router14.route("/update-branding").post(authMiddleware, updateBranding);
router14.route("/update-branding/logo").post(authMiddleware, updateBrandingLogo);
router14.route("/delete-branding/logo").delete(authMiddleware, deleteBrandingLogo);
var branding_routes_default = router14;

// src/routes/banner.routes.ts
import express15 from "express";

// src/controllers/banner.controllers.ts
import { z as z12 } from "zod";
var CreateBannerSchema = z12.object({
  title: z12.string(),
  imageUrl: z12.string(),
  linkUrl: z12.string().optional().nullable(),
  position: z12.string(),
  sortOrder: z12.number(),
  isActive: z12.boolean()
});
var createBanner = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const validation = CreateBannerSchema.safeParse(req.body);
  console.log(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const {
    title,
    imageUrl,
    linkUrl,
    position,
    sortOrder,
    isActive
  } = validation.data;
  const newBanner = await prisma.banner.create({
    data: {
      title,
      imageUrl,
      linkUrl: linkUrl || null,
      position,
      sortOrder,
      isActive
    }
  });
  if (!newBanner) {
    throw new ApiError(500, "Internal server error creating banner");
  }
  return res.status(201).json(new ApiResponse(201, "Created banner successfully", { banner: newBanner }));
});
var UpdateBannerSchema = z12.object({
  bannerId: z12.string(),
  title: z12.string(),
  imageUrl: z12.string(),
  linkUrl: z12.string().optional().nullable(),
  position: z12.string(),
  sortOrder: z12.number(),
  isActive: z12.boolean()
});
var updateBanner = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const validation = UpdateBannerSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const {
    bannerId,
    title,
    imageUrl,
    position,
    linkUrl,
    isActive,
    sortOrder
  } = validation.data;
  const updatedBanner = await prisma.banner.update({
    where: {
      id: bannerId
    },
    data: {
      title,
      imageUrl,
      position,
      linkUrl: linkUrl || null,
      isActive,
      sortOrder
    }
  });
  if (!updatedBanner) {
    throw new ApiError(500, "Internal server error updating banner");
  }
  return res.status(200).json(new ApiResponse(200, "Updated banner successfully"));
});
var DeleteBannerSchema = z12.object({
  bannerId: z12.string()
});
var deleteBanner = asyncHandler_default(async (req, res) => {
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
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }
  const validation = DeleteBannerSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { bannerId } = validation.data;
  const existedBanner = await prisma.banner.findUnique({
    where: {
      id: bannerId
    }
  });
  if (!existedBanner) {
    throw new ApiError(404, "Banner not found");
  }
  const path6 = existedBanner.imageUrl.split("/uploads/");
  const fileId = path6[path6.length - 1];
  deleteFile_default(fileId || "");
  const deletedBanner = await prisma.banner.delete({
    where: {
      id: existedBanner.id
    }
  });
  if (!deletedBanner) {
    throw new ApiError(500, "Internal server error deleting banner");
  }
  return res.status(200).json(new ApiResponse(200, "Deleted banner successfully", { banner: deletedBanner }));
});
var getBanners = asyncHandler_default(async (req, res) => {
  const banners = await prisma.banner.findMany();
  return res.status(200).json(new ApiResponse(200, "Successfully fetched banners", { banners }));
});

// src/routes/banner.routes.ts
var router15 = express15.Router();
router15.route("/").get(getBanners);
router15.route("/create-banner").post(authMiddleware, createBanner);
router15.route("/update-banner").put(authMiddleware, updateBanner);
router15.route("/delete-banner").delete(authMiddleware, deleteBanner);
var banner_routes_default = router15;

// src/middlewares/error.middleware.ts
var errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  console.error("\u{1F525} Error:", err);
  res.status(statusCode).json({
    success: false,
    message
  });
};

// src/app.ts
import cookieParser from "cookie-parser";
import path5 from "path";
import { fileURLToPath as fileURLToPath5 } from "url";
var __filename4 = fileURLToPath5(import.meta.url);
var __dirname4 = path5.dirname(__filename4);
var app = express16();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use(express16.json());
app.use(cookieParser());
app.use(express16.urlencoded({ extended: true }));
app.use(express16.static(path5.join(__dirname4, "../public")));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", auth_routes_default);
app.use("/api/upload", upload_routes_default);
app.use("/api/delete", delete_routes_default);
app.use("/api/category", category_routes_default);
app.use("/api/product", product_routes_default);
app.use("/api/stats", stats_routes_default);
app.use("/api/cart", cart_routes_default);
app.use("/api/order", order_routes_default);
app.use("/api/payment", payment_routes_default);
app.use("/api/customer", customers_routes_default);
app.use("/api/branding", branding_routes_default);
app.use("/api/banner", banner_routes_default);
app.use("/api/payment-gateway", paymentGateway_routes_default);
app.use("/api/employee", employee_routes_default);
app.use("/api/delivery", deliveryPersonnel_routes_default);
app.use(errorHandler);
var app_default = app;

// src/server.ts
import { createServer } from "http";
dotenv.config();
var server = createServer(app_default);
var PORT = process.env.PORT || 5e3;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
process.on("uncaughtException", async (error) => {
  console.log("Uncaught exception", error);
  await disconnectDB();
  process.exit(1);
});
process.on("unhandledRejection", async (error) => {
  console.log("Unhandled rejection", error);
  await disconnectDB();
  process.exit(1);
});
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received");
  await disconnectDB();
  process.exit(0);
});
