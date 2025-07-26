import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { courseSchema } from "../validations/course.schema";
import { CourseController } from "../controllers/course.controller";

const router = Router();
const courseController = new CourseController();

router.use(authMiddleware);

// Get all courses
router.get("/", courseController.getAllCourses);

// Get course by id
router.get("/:id", courseController.getCourseById);

// Create new course
router.post("/", validate(courseSchema.create), courseController.createCourse);

// Update course
router.put(
  "/:id",
  validate(courseSchema.update),
  courseController.updateCourse
);

// Delete course
router.delete("/:id", courseController.deleteCourse);

// Get students in a course
router.get("/:id/students", courseController.getCourseStudents);

export default router;
