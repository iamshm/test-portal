import axios from "axios";
import type {
  AttendanceWithStudent,
  StudentAttendanceSummary,
  ClassAttendanceSummary,
  BulkAttendanceData,
} from "../types/attendance";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const attendanceApi = {
  getClassAttendance: async (
    timetableId: number,
    date: string
  ): Promise<AttendanceWithStudent[]> => {
    const response = await api.get<{ attendance: AttendanceWithStudent[] }>(
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

    const response = await api.get<{ summary: StudentAttendanceSummary }>(
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

    const response = await api.get<{ summary: ClassAttendanceSummary[] }>(
      `/attendance/course/${courseId}/summary`,
      { params }
    );
    return response.data.summary;
  },

  markBulkAttendance: async (data: BulkAttendanceData): Promise<void> => {
    await api.post("/attendance/mark-bulk", data);
  },

  updateAttendance: async (
    attendanceId: number,
    status: "present" | "absent"
  ): Promise<void> => {
    await api.put(`/attendance/${attendanceId}`, { status });
  },

  deleteAttendance: async (attendanceId: number): Promise<void> => {
    await api.delete(`/attendance/${attendanceId}`);
  },
};
