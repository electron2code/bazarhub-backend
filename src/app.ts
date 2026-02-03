import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";
import uploadRoutes from "./routes/upload.routes.ts";
import deleteRoutes from "./routes/delete.routes.ts";
import categoryRoutes from "./routes/category.routes.ts";
import productRoutes from "./routes/product.routes.ts";
import statsRoutes from "./routes/stats.routes.ts";
import cartRoutes from "./routes/cart.routes.ts";
import orderRoutes from "./routes/order.routes.ts";
import paymentRoutes from "./routes/payment.routes.ts";
import paymentGatewayRoutes from "./routes/paymentGateway.routes.ts";

import customerRoutes from "./routes/customers.routes.ts";
import employeeRoutes from "./routes/employee.routes.ts";
import deliveryPersonnelRoutes from "./routes/deliveryPersonnel.routes.ts"

import brandingRoutes from "./routes/branding.routes.ts";
import bannerRoutes from "./routes/banner.routes.ts";

import { errorHandler } from "./middlewares/error.middleware.ts";
import cookieParser from "cookie-parser";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use((req: any, res: any, next: any) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/delete", deleteRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/api/customer", customerRoutes);
app.use("/api/branding", brandingRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/payment-gateway", paymentGatewayRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/delivery", deliveryPersonnelRoutes);


app.use(errorHandler);
export default app;