import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Files will be saved in the './public/uploads' directory
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
        // Use a unique filename combining the current timestamp and original extension
        cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`);
    },
});
const fileFilter = function (req, file, cb) {
    // Accept only images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff|ico)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
        files: 1 // Maximum number of files
    }
});
export default upload;
