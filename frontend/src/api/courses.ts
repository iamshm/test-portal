import axios from "axios";
import type {
  Course,
  CreateCourseData,
  UpdateCourseData,
  CourseWithStudentCount,
} from "../types/course";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const courseApi = {
  getAllCourses: async (): Promise<CourseWithStudentCount[]> => {
    const response = await api.get<{ courses: CourseWithStudentCount[] }>(
      "/courses"
    );
    return response.data.courses;
  },

  getCourseById: async (id: number): Promise<Course> => {
    const response = await api.get<{ course: Course }>(`/courses/${id}`);
    return response.data.course;
  },

  createCourse: async (data: CreateCourseData): Promise<Course> => {
    const response = await api.post<{ course: Course }>("/courses", data);
    return response.data.course;
  },

  updateCourse: async (data: UpdateCourseData): Promise<Course> => {
    const response = await api.put<{ course: Course }>(
      `/courses/${data.id}`,
      data
    );
    return response.data.course;
  },

  deleteCourse: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
};
