import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import ocrRoutes from "./routes/ocr.routes";
import timetableRoutes from "./routes/timetable.routes";
import studentRoutes from "./routes/student.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/students", studentRoutes);

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
