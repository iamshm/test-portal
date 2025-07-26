import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validation.middleware";
import { attendanceSchema } from "../validations/attendance.schema";

const router = Router();
const attendanceController = new AttendanceController();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get class attendance
router.get(
  "/class/:timetableId/:date",
  attendanceController.getClassAttendance.bind(attendanceController)
);

// Get student attendance
router.get(
  "/student/:studentId/course/:courseId",
  attendanceController.getStudentAttendance.bind(attendanceController)
);

// Get course attendance summary
router.get(
  "/course/:courseId/summary",
  attendanceController.getCourseAttendanceSummary.bind(attendanceController)
);

// Mark bulk attendance
router.post(
  "/mark-bulk",
  validate(attendanceSchema.markBulk),
  attendanceController.markBulkAttendance.bind(attendanceController)
);

// Update attendance
router.put(
  "/:id",
  validate(attendanceSchema.update),
  attendanceController.updateAttendance.bind(attendanceController)
);

// Delete attendance
router.delete(
  "/:id",
  attendanceController.deleteAttendance.bind(attendanceController)
);

export default router;
