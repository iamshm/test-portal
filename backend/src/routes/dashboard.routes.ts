import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get today's schedule
router.get("/schedule/today", dashboardController.getTodaySchedule);

// Get quick stats
router.get("/stats", dashboardController.getQuickStats);

// Get attendance overview
router.get("/attendance/overview", dashboardController.getAttendanceOverview);

export default router;
