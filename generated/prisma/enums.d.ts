export declare const Role: {
    readonly ADMIN: "ADMIN";
    readonly USER: "USER";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const Provider: {
    readonly LOCAL: "LOCAL";
    readonly GOOGLE: "GOOGLE";
};
export type Provider = (typeof Provider)[keyof typeof Provider];
export declare const Type: {
    readonly RETAIL: "RETAIL";
    readonly WHOLESALE: "WHOLESALE";
};
export type Type = (typeof Type)[keyof typeof Type];
export declare const ProductStatus: {
    readonly DRAFT: "DRAFT";
    readonly ACTIVE: "ACTIVE";
    readonly ARCHIVED: "ARCHIVED";
};
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
export declare const OrderStatus: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly RETURNED: "RETURNED";
    readonly REFUNDED: "REFUNDED";
    readonly PENDING_REFUND: "PENDING_REFUND";
    readonly COMPLETED_REFUND: "COMPLETED_REFUND";
    readonly CANCELLED_REFUND: "CANCELLED_REFUND";
    readonly RETURNED_REFUND: "RETURNED_REFUND";
    readonly REFUNDED_REFUND: "REFUNDED_REFUND";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const Visibility: {
    readonly RETAIL: "RETAIL";
    readonly WHOLESALE: "WHOLESALE";
    readonly BOTH: "BOTH";
};
export type Visibility = (typeof Visibility)[keyof typeof Visibility];
export declare const EmployeeRole: {
    readonly MANAGER: "MANAGER";
    readonly SUPPORT: "SUPPORT";
    readonly CONTENT: "CONTENT";
    readonly WAREHOUSE: "WAREHOUSE";
};
export type EmployeeRole = (typeof EmployeeRole)[keyof typeof EmployeeRole];
