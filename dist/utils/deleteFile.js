import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const deleteFile = async (fileId) => {
    try {
        const filePath = path.join(__dirname, "../../public", "uploads", fileId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    catch (error) {
        throw error;
    }
};
export default deleteFile;
