import type {
  AttendanceWithStudent,
  StudentAttendanceSummary,
  ClassAttendanceSummary,
  BulkAttendanceData,
} from "../types/attendance";
import { apiClient } from "./client";

export const attendanceApi = {
  getClassAttendance: async (
    timetableId: number,
    date: string
  ): Promise<AttendanceWithStudent[]> => {
    const response = await apiClient.get<{ attendance: AttendanceWithStudent[] }>(
      `/attendance/class/${timetableId}/${date}`
    );
    return response.data.attendance;
  },

  getStudentAttendance: async (
    studentId: number,
    courseId: number,
    startDate?: string,
    endDate?: string
  ): Promise<StudentAttendanceSummary> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await apiClient.get<{ summary: StudentAttendanceSummary }>(
      `/attendance/student/${studentId}/course/${courseId}`,
      { params }
    );
    return response.data.summary;
  },

  getCourseAttendanceSummary: async (
    courseId: number,
    startDate?: string,
    endDate?: string
  ): Promise<ClassAttendanceSummary[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await apiClient.get<{ summary: ClassAttendanceSummary[] }>(
      `/attendance/course/${courseId}/summary`,
      { params }
    );
    return response.data.summary;
  },

  markBulkAttendance: async (data: BulkAttendanceData): Promise<void> => {
    await apiClient.post("/attendance/mark-bulk", data);
  },

  updateAttendance: async (
    attendanceId: number,
    status: "present" | "absent"
  ): Promise<void> => {
    await apiClient.put(`/attendance/${attendanceId}`, { status });
  },

  deleteAttendance: async (attendanceId: number): Promise<void> => {
    await apiClient.delete(`/attendance/${attendanceId}`);
  },
};
