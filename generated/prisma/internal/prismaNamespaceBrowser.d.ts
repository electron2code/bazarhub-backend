import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.ts';
export type * from './prismaNamespace.ts';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Product: "Product";
    readonly ProductImage: "ProductImage";
    readonly Category: "Category";
    readonly Cart: "Cart";
    readonly CartItem: "CartItem";
    readonly Order: "Order";
    readonly OrderItem: "OrderItem";
    readonly ShippingAddress: "ShippingAddress";
    readonly BrandLogo: "BrandLogo";
    readonly Branding: "Branding";
    readonly Banner: "Banner";
    readonly PaymentGateway: "PaymentGateway";
    readonly PaymentGatewayConfig: "PaymentGatewayConfig";
    readonly Employee: "Employee";
    readonly DeliveryPersonnel: "DeliveryPersonnel";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly password: "password";
    readonly provider: "provider";
    readonly googleId: "googleId";
    readonly isEmailVerified: "isEmailVerified";
    readonly emailVerificationToken: "emailVerificationToken";
    readonly emailVerificationExpiry: "emailVerificationExpiry";
    readonly role: "role";
    readonly type: "type";
    readonly refreshToken: "refreshToken";
    readonly refreshTokenExpiry: "refreshTokenExpiry";
    readonly createdAt: "createdAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const ProductScalarFieldEnum: {
    readonly id: "id";
    readonly name_en: "name_en";
    readonly name_bn: "name_bn";
    readonly description_en: "description_en";
    readonly description_bn: "description_bn";
    readonly slug: "slug";
    readonly sku: "sku";
    readonly retailPrice: "retailPrice";
    readonly wholesalePrice: "wholesalePrice";
    readonly stock: "stock";
    readonly minWholesaleQty: "minWholesaleQty";
    readonly status: "status";
    readonly isFeatured: "isFeatured";
    readonly type: "type";
    readonly categoryId: "categoryId";
    readonly visibility: "visibility";
    readonly isActive: "isActive";
    readonly isInhouse: "isInhouse";
    readonly sellerId: "sellerId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum];
export declare const ProductImageScalarFieldEnum: {
    readonly id: "id";
    readonly url: "url";
    readonly productId: "productId";
};
export type ProductImageScalarFieldEnum = (typeof ProductImageScalarFieldEnum)[keyof typeof ProductImageScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: "id";
    readonly name_en: "name_en";
    readonly name_bn: "name_bn";
    readonly slug: "slug";
    readonly description: "description";
    readonly imageUrl: "imageUrl";
    readonly parentCategoryId: "parentCategoryId";
    readonly sortOrder: "sortOrder";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const CartScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CartScalarFieldEnum = (typeof CartScalarFieldEnum)[keyof typeof CartScalarFieldEnum];
export declare const CartItemScalarFieldEnum: {
    readonly id: "id";
    readonly cartId: "cartId";
    readonly image: "image";
    readonly productId: "productId";
    readonly name: "name";
    readonly minWholesaleQty: "minWholesaleQty";
    readonly retailPrice: "retailPrice";
    readonly wholesalePrice: "wholesalePrice";
    readonly quantity: "quantity";
    readonly buyerType: "buyerType";
};
export type CartItemScalarFieldEnum = (typeof CartItemScalarFieldEnum)[keyof typeof CartItemScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id: "id";
    readonly orderNumber: "orderNumber";
    readonly userId: "userId";
    readonly totalAmount: "totalAmount";
    readonly status: "status";
    readonly paymentStatus: "paymentStatus";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const OrderItemScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly productId: "productId";
    readonly name: "name";
    readonly price: "price";
    readonly quantity: "quantity";
    readonly sku: "sku";
};
export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum];
export declare const ShippingAddressScalarFieldEnum: {
    readonly id: "id";
    readonly address: "address";
    readonly city: "city";
    readonly postalCode: "postalCode";
    readonly phone: "phone";
    readonly fullName: "fullName";
    readonly orderId: "orderId";
};
export type ShippingAddressScalarFieldEnum = (typeof ShippingAddressScalarFieldEnum)[keyof typeof ShippingAddressScalarFieldEnum];
export declare const BrandLogoScalarFieldEnum: {
    readonly id: "id";
    readonly url: "url";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BrandLogoScalarFieldEnum = (typeof BrandLogoScalarFieldEnum)[keyof typeof BrandLogoScalarFieldEnum];
export declare const BrandingScalarFieldEnum: {
    readonly id: "id";
    readonly brandName: "brandName";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BrandingScalarFieldEnum = (typeof BrandingScalarFieldEnum)[keyof typeof BrandingScalarFieldEnum];
export declare const BannerScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly imageUrl: "imageUrl";
    readonly linkUrl: "linkUrl";
    readonly position: "position";
    readonly sortOrder: "sortOrder";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BannerScalarFieldEnum = (typeof BannerScalarFieldEnum)[keyof typeof BannerScalarFieldEnum];
export declare const PaymentGatewayScalarFieldEnum: {
    readonly id: "id";
    readonly gateway_id: "gateway_id";
    readonly name: "name";
    readonly description: "description";
    readonly icon: "icon";
    readonly is_enabled: "is_enabled";
    readonly is_configured: "is_configured";
};
export type PaymentGatewayScalarFieldEnum = (typeof PaymentGatewayScalarFieldEnum)[keyof typeof PaymentGatewayScalarFieldEnum];
export declare const PaymentGatewayConfigScalarFieldEnum: {
    readonly api_key: "api_key";
    readonly paymentGatewayId: "paymentGatewayId";
};
export type PaymentGatewayConfigScalarFieldEnum = (typeof PaymentGatewayConfigScalarFieldEnum)[keyof typeof PaymentGatewayConfigScalarFieldEnum];
export declare const EmployeeScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly role: "role";
    readonly department: "department";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EmployeeScalarFieldEnum = (typeof EmployeeScalarFieldEnum)[keyof typeof EmployeeScalarFieldEnum];
export declare const DeliveryPersonnelScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly phoneNumber: "phoneNumber";
    readonly email: "email";
    readonly isActive: "isActive";
};
export type DeliveryPersonnelScalarFieldEnum = (typeof DeliveryPersonnelScalarFieldEnum)[keyof typeof DeliveryPersonnelScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const UserOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly password: "password";
    readonly googleId: "googleId";
    readonly emailVerificationToken: "emailVerificationToken";
    readonly refreshToken: "refreshToken";
};
export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum];
export declare const ProductOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name_en: "name_en";
    readonly name_bn: "name_bn";
    readonly description_en: "description_en";
    readonly description_bn: "description_bn";
    readonly slug: "slug";
    readonly sku: "sku";
    readonly categoryId: "categoryId";
    readonly sellerId: "sellerId";
};
export type ProductOrderByRelevanceFieldEnum = (typeof ProductOrderByRelevanceFieldEnum)[keyof typeof ProductOrderByRelevanceFieldEnum];
export declare const ProductImageOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly url: "url";
    readonly productId: "productId";
};
export type ProductImageOrderByRelevanceFieldEnum = (typeof ProductImageOrderByRelevanceFieldEnum)[keyof typeof ProductImageOrderByRelevanceFieldEnum];
export declare const CategoryOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name_en: "name_en";
    readonly name_bn: "name_bn";
    readonly slug: "slug";
    readonly description: "description";
    readonly imageUrl: "imageUrl";
    readonly parentCategoryId: "parentCategoryId";
};
export type CategoryOrderByRelevanceFieldEnum = (typeof CategoryOrderByRelevanceFieldEnum)[keyof typeof CategoryOrderByRelevanceFieldEnum];
export declare const CartOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
};
export type CartOrderByRelevanceFieldEnum = (typeof CartOrderByRelevanceFieldEnum)[keyof typeof CartOrderByRelevanceFieldEnum];
export declare const CartItemOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly cartId: "cartId";
    readonly image: "image";
    readonly productId: "productId";
    readonly name: "name";
};
export type CartItemOrderByRelevanceFieldEnum = (typeof CartItemOrderByRelevanceFieldEnum)[keyof typeof CartItemOrderByRelevanceFieldEnum];
export declare const OrderOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly orderNumber: "orderNumber";
    readonly userId: "userId";
};
export type OrderOrderByRelevanceFieldEnum = (typeof OrderOrderByRelevanceFieldEnum)[keyof typeof OrderOrderByRelevanceFieldEnum];
export declare const OrderItemOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly productId: "productId";
    readonly name: "name";
    readonly sku: "sku";
};
export type OrderItemOrderByRelevanceFieldEnum = (typeof OrderItemOrderByRelevanceFieldEnum)[keyof typeof OrderItemOrderByRelevanceFieldEnum];
export declare const ShippingAddressOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly address: "address";
    readonly city: "city";
    readonly postalCode: "postalCode";
    readonly phone: "phone";
    readonly fullName: "fullName";
    readonly orderId: "orderId";
};
export type ShippingAddressOrderByRelevanceFieldEnum = (typeof ShippingAddressOrderByRelevanceFieldEnum)[keyof typeof ShippingAddressOrderByRelevanceFieldEnum];
export declare const BrandLogoOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly url: "url";
};
export type BrandLogoOrderByRelevanceFieldEnum = (typeof BrandLogoOrderByRelevanceFieldEnum)[keyof typeof BrandLogoOrderByRelevanceFieldEnum];
export declare const BrandingOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly brandName: "brandName";
};
export type BrandingOrderByRelevanceFieldEnum = (typeof BrandingOrderByRelevanceFieldEnum)[keyof typeof BrandingOrderByRelevanceFieldEnum];
export declare const BannerOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly imageUrl: "imageUrl";
    readonly linkUrl: "linkUrl";
    readonly position: "position";
};
export type BannerOrderByRelevanceFieldEnum = (typeof BannerOrderByRelevanceFieldEnum)[keyof typeof BannerOrderByRelevanceFieldEnum];
export declare const PaymentGatewayOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly gateway_id: "gateway_id";
    readonly name: "name";
    readonly description: "description";
    readonly icon: "icon";
};
export type PaymentGatewayOrderByRelevanceFieldEnum = (typeof PaymentGatewayOrderByRelevanceFieldEnum)[keyof typeof PaymentGatewayOrderByRelevanceFieldEnum];
export declare const PaymentGatewayConfigOrderByRelevanceFieldEnum: {
    readonly api_key: "api_key";
    readonly paymentGatewayId: "paymentGatewayId";
};
export type PaymentGatewayConfigOrderByRelevanceFieldEnum = (typeof PaymentGatewayConfigOrderByRelevanceFieldEnum)[keyof typeof PaymentGatewayConfigOrderByRelevanceFieldEnum];
export declare const EmployeeOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly department: "department";
};
export type EmployeeOrderByRelevanceFieldEnum = (typeof EmployeeOrderByRelevanceFieldEnum)[keyof typeof EmployeeOrderByRelevanceFieldEnum];
export declare const DeliveryPersonnelOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly phoneNumber: "phoneNumber";
    readonly email: "email";
};
export type DeliveryPersonnelOrderByRelevanceFieldEnum = (typeof DeliveryPersonnelOrderByRelevanceFieldEnum)[keyof typeof DeliveryPersonnelOrderByRelevanceFieldEnum];
