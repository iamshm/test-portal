import type {
  Timetable,
  TimetableWithCourse,
  CreateTimetableData,
  UpdateTimetableData,
} from "../types/timetable";
import { apiClient } from "./client";

export const timetableApi = {
  getAllTimetables: async (): Promise<TimetableWithCourse[]> => {
    const response = await apiClient.get<{ timetables: TimetableWithCourse[] }>(
      "/timetable"
    );
    return response.data.timetables;
  },

  getTimetableById: async (id: number): Promise<TimetableWithCourse> => {
    const response = await apiClient.get<{ timetable: TimetableWithCourse }>(
      `/timetable/${id}`
    );
    return response.data.timetable;
  },

  createTimetable: async (data: CreateTimetableData): Promise<Timetable> => {
    const response = await apiClient.post<{ timetable: Timetable }>(
      "/timetable",
      data
    );
    return response.data.timetable;
  },

  updateTimetable: async (data: UpdateTimetableData): Promise<Timetable> => {
    const response = await apiClient.put<{ timetable: Timetable }>(
      `/timetable/${data.id}`,
      data
    );
    return response.data.timetable;
  },

  deleteTimetable: async (id: number): Promise<void> => {
    await apiClient.delete(`/timetable/${id}`);
  },

  getTimetableByFaculty: async (
    facultyId: number
  ): Promise<TimetableWithCourse[]> => {
    const response = await apiClient.get<{ timetables: TimetableWithCourse[] }>(
      `/faculty/${facultyId}/timetable`
    );
    return response.data.timetables;
  },

  getTimetableByCourse: async (
    courseId: number
  ): Promise<TimetableWithCourse[]> => {
    const response = await apiClient.get<{ timetables: TimetableWithCourse[] }>(
      `/courses/${courseId}/timetable`
    );
    return response.data.timetables;
  },

  checkTimeSlotAvailability: async (
    facultyId: number,
    dayOfWeek: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> => {
    const response = await apiClient.get<{ isAvailable: boolean }>(
      `/timetable/check-availability`,
      {
        params: {
          facultyId,
          dayOfWeek,
          startTime,
          endTime,
        },
      }
    );
    return response.data.isAvailable;
  },
};
