import { Router } from "express";
import { TimetableController } from "../controllers/timetable.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const timetableController = new TimetableController();

// Protected routes
router.use(authMiddleware);

// Get faculty's timetable
router.get("/my-schedule", timetableController.getMySchedule);

// Get faculty's courses
router.get("/my-courses", timetableController.getMyCourses);

// Update timetable entry
router.put("/:id", timetableController.updateEntry);

// Delete timetable entry
router.delete("/:id", timetableController.deleteEntry);

export default router;
