export interface Timetable {
  id: number;
  facultyId: number;
  courseId: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  venue: string | null;
  createdAt: string;
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface TimetableWithCourse extends Timetable {
  course: {
    courseCode: string;
    courseName: string;
  };
}

export interface CreateTimetableData {
  courseId: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  venue?: string;
}

export interface UpdateTimetableData extends CreateTimetableData {
  id: number;
}

export interface TimeSlot {
  time: string;
  isBooked: boolean;
  timetable?: TimetableWithCourse;
}

export interface DaySchedule {
  day: DayOfWeek;
  slots: TimeSlot[];
}

export interface WeekSchedule {
  days: DaySchedule[];
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});
