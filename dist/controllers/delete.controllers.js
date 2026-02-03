import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../db/db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const deleteCategoryThumbnail = asyncHandler(async (req, res) => {
    const id = req.user.id;
    if (!id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: id
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
    const filePath = path.join(__dirname, "../../public/uploads", filename);
    if (!fs.existsSync(filePath)) {
        throw new ApiError(404, "File not found");
    }
    fs.unlink(filePath, (err) => {
        if (err) {
            throw new ApiError(500, "Failed to delete file");
        }
        else {
            res.status(200).json(new ApiResponse(200, "File deleted successfully"));
        }
    });
});
