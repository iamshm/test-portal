import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service";

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  async getClassAttendance(req: Request, res: Response) {
    try {
      const { timetableId, date } = req.params;
      const attendance = await this.attendanceService.getClassAttendance(
        parseInt(timetableId),
        date
      );
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance" });
    }
  }

  async markBulkAttendance(req: Request, res: Response) {
    try {
      const { timetableId, date, attendance } = req.body;
      const result = await this.attendanceService.markBulkAttendance(
        timetableId,
        date,
        attendance
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark attendance" });
    }
  }

  async getStudentAttendance(req: Request, res: Response) {
    try {
      const { studentId, courseId } = req.params;
      const attendance = await this.attendanceService.getStudentAttendance(
        parseInt(studentId),
        parseInt(courseId)
      );
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student attendance" });
    }
  }

  async getCourseAttendanceSummary(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const summary = await this.attendanceService.getCourseAttendanceSummary(
        parseInt(courseId)
      );
      res.json(summary);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch course attendance summary" });
    }
  }

  // These methods are not implemented in the service yet
  async updateAttendance(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented" });
  }

  async deleteAttendance(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented" });
  }
}
