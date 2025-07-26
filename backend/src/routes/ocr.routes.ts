import { Router } from "express";
import { OCRController, upload } from "../controllers/ocr.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const ocrController = new OCRController();

// Protected routes
router.use(authMiddleware);

// Upload and process timetable image
router.post("/upload", upload.single("image"), ocrController.uploadImage);

export default router;
