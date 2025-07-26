import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const studentController = new StudentController();

// Protected routes
router.use(authMiddleware);

// Get students by course
router.get("/by-course/:courseId", studentController.getStudentsByCourse);

// Add new student
router.post("/", studentController.createStudent);

// Update student info
router.put("/:id", studentController.updateStudent);

// Remove student
router.delete("/:id", studentController.deleteStudent);

export default router;
