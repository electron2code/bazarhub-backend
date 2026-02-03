import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client.js';

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST as string,
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    database: process.env.DATABASE_NAME as string,
    connectionLimit: 5
});
const prisma = new PrismaClient({ adapter });

export { prisma }

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to database");
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log("Disconnected from database");
    } catch (error) {
        console.error("Error disconnecting from database", error);
        process.exit(1);
    }
}

export { connectDB, disconnectDB }