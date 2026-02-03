import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { createServer } from "http";
import { connectDB, disconnectDB } from "./db/db.js";

const server = createServer(app);

const PORT = process.env.PORT || 5000;
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

