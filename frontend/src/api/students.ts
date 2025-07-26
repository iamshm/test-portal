import axios from "axios";
import type {
  Student,
  StudentWithCourse,
  CreateStudentData,
  UpdateStudentData,
  StudentAttendance,
} from "../types/student";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const studentApi = {
  getAllStudents: async (): Promise<StudentWithCourse[]> => {
    const response = await api.get<{ students: StudentWithCourse[] }>(
      "/students"
    );
    return response.data.students;
  },

  getStudentsByCourse: async (courseId: number): Promise<Student[]> => {
    const response = await api.get<{ students: Student[] }>(
      `/courses/${courseId}/students`
    );
    return response.data.students;
  },

  getStudentById: async (id: number): Promise<StudentWithCourse> => {
    const response = await api.get<{ student: StudentWithCourse }>(
      `/students/${id}`
    );
    return response.data.student;
  },

  createStudent: async (data: CreateStudentData): Promise<Student> => {
    const response = await api.post<{ student: Student }>("/students", data);
    return response.data.student;
  },

  updateStudent: async (data: UpdateStudentData): Promise<Student> => {
    const response = await api.put<{ student: Student }>(
      `/students/${data.id}`,
      data
    );
    return response.data.student;
  },

  deleteStudent: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },

  getStudentAttendance: async (
    studentId: number,
    startDate?: string,
    endDate?: string
  ): Promise<StudentAttendance[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await api.get<{ attendance: StudentAttendance[] }>(
      `/students/${studentId}/attendance`,
      { params }
    );
    return response.data.attendance;
  },
};
