import { z } from "zod";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const timetableSchema = {
  create: z.object({
    body: z.object({
      courseId: z
        .number()
        .int("Course ID must be an integer")
        .positive("Course ID must be positive"),
      dayOfWeek: z.enum(daysOfWeek, {
        errorMap: () => ({ message: "Invalid day of week" }),
      }),
      startTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
      endTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
      venue: z
        .string()
        .min(2, "Venue must be at least 2 characters")
        .max(255, "Venue cannot exceed 255 characters")
        .optional()
        .nullable(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().transform(Number),
    }),
    body: z.object({
      courseId: z
        .number()
        .int("Course ID must be an integer")
        .positive("Course ID must be positive")
        .optional(),
      dayOfWeek: z
        .enum(daysOfWeek, {
          errorMap: () => ({ message: "Invalid day of week" }),
        })
        .optional(),
      startTime: z
        .string()
        .regex(timeRegex, "Invalid time format (HH:mm)")
        .optional(),
      endTime: z
        .string()
        .regex(timeRegex, "Invalid time format (HH:mm)")
        .optional(),
      venue: z
        .string()
        .min(2, "Venue must be at least 2 characters")
        .max(255, "Venue cannot exceed 255 characters")
        .optional()
        .nullable(),
    }),
  }),

  checkAvailability: z.object({
    body: z.object({
      dayOfWeek: z.enum(daysOfWeek, {
        errorMap: () => ({ message: "Invalid day of week" }),
      }),
      startTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
      endTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
      facultyId: z
        .number()
        .int("Faculty ID must be an integer")
        .positive("Faculty ID must be positive"),
      excludeTimetableId: z
        .number()
        .int("Timetable ID must be an integer")
        .positive("Timetable ID must be positive")
        .optional(),
    }),
  }),
};
