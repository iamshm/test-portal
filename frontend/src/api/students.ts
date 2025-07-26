import type {
  Student,
  StudentWithCourse,
  CreateStudentData,
  UpdateStudentData,
  StudentAttendance,
} from "../types/student";
import { apiClient } from "./client";

export const studentApi = {
  getAllStudents: async (): Promise<StudentWithCourse[]> => {
    const response = await apiClient.get<{ students: StudentWithCourse[] }>(
      "/students"
    );
    return response.data.students;
  },

  getStudentsByCourse: async (courseId: number): Promise<Student[]> => {
    const response = await apiClient.get<{ students: Student[] }>(
      `/courses/${courseId}/students`
    );
    return response.data.students;
  },

  getStudentById: async (id: number): Promise<StudentWithCourse> => {
    const response = await apiClient.get<{ student: StudentWithCourse }>(
      `/students/${id}`
    );
    return response.data.student;
  },

  createStudent: async (data: CreateStudentData): Promise<Student> => {
    const response = await apiClient.post<{ student: Student }>("/students", data);
    return response.data.student;
  },

  updateStudent: async (data: UpdateStudentData): Promise<Student> => {
    const response = await apiClient.put<{ student: Student }>(
      `/students/${data.id}`,
      data
    );
    return response.data.student;
  },

  deleteStudent: async (id: number): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },

  getStudentAttendance: async (
    studentId: number,
    startDate?: string,
    endDate?: string
  ): Promise<StudentAttendance[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await apiClient.get<{ attendance: StudentAttendance[] }>(
      `/students/${studentId}/attendance`,
      { params }
    );
    return response.data.attendance;
  },
};
