import type {
  Course,
  CreateCourseData,
  UpdateCourseData,
  CourseWithStudentCount,
} from "../types/course";
import { apiClient } from "./client";

export const courseApi = {
  getAllCourses: async (): Promise<CourseWithStudentCount[]> => {
    const response = await apiClient.get<{ courses: CourseWithStudentCount[] }>(
      "/courses"
    );
    return response.data.courses;
  },

  getCourseById: async (id: number): Promise<Course> => {
    const response = await apiClient.get<{ course: Course }>(`/courses/${id}`);
    return response.data.course;
  },

  createCourse: async (data: CreateCourseData): Promise<Course> => {
    const response = await apiClient.post<{ course: Course }>("/courses", data);
    return response.data.course;
  },

  updateCourse: async (data: UpdateCourseData): Promise<Course> => {
    const response = await apiClient.put<{ course: Course }>(
      `/courses/${data.id}`,
      data
    );
    return response.data.course;
  },

  deleteCourse: async (id: number): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },
};
