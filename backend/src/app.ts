import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import ocrRoutes from "./routes/ocr.routes";
import timetableRoutes from "./routes/timetable.routes";
import studentRoutes from "./routes/student.routes";
import courseRoutes from "./routes/course.routes";
import attendanceRoutes from "./routes/attendance.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { config } from "./config";

const app = express();

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  }
);

export default app;
