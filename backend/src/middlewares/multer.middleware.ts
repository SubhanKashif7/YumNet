import multer from "multer";
import path from "path";
import fs from "fs";

// Create a temporary upload directory if it doesn't exist
const tempUploadDir = path.join(__dirname, "../temp-uploads");
if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const multerMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB
    }
});

export default multerMiddleware;