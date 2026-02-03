import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.ts";
import * as Prisma from "./internal/prismaNamespace.ts";
export * as $Enums from './enums.ts';
export * from "./enums.ts";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model Product
 *
 */
export type Product = Prisma.ProductModel;
/**
 * Model ProductImage
 *
 */
export type ProductImage = Prisma.ProductImageModel;
/**
 * Model Category
 *
 */
export type Category = Prisma.CategoryModel;
/**
 * Model Cart
 *
 */
export type Cart = Prisma.CartModel;
/**
 * Model CartItem
 *
 */
export type CartItem = Prisma.CartItemModel;
/**
 * Model Order
 *
 */
export type Order = Prisma.OrderModel;
/**
 * Model OrderItem
 *
 */
export type OrderItem = Prisma.OrderItemModel;
/**
 * Model ShippingAddress
 *
 */
export type ShippingAddress = Prisma.ShippingAddressModel;
/**
 * Model BrandLogo
 *
 */
export type BrandLogo = Prisma.BrandLogoModel;
/**
 * Model Branding
 *
 */
export type Branding = Prisma.BrandingModel;
/**
 * Model Banner
 *
 */
export type Banner = Prisma.BannerModel;
/**
 * Model PaymentGateway
 *
 */
export type PaymentGateway = Prisma.PaymentGatewayModel;
/**
 * Model PaymentGatewayConfig
 *
 */
export type PaymentGatewayConfig = Prisma.PaymentGatewayConfigModel;
/**
 * Model Employee
 *
 */
export type Employee = Prisma.EmployeeModel;
/**
 * Model DeliveryPersonnel
 *
 */
export type DeliveryPersonnel = Prisma.DeliveryPersonnelModel;
