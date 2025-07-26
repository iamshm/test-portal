import { z } from "zod";

export const courseSchema = {
  create: z.object({
    body: z.object({
      courseCode: z
        .string()
        .min(2, "Course code must be at least 2 characters")
        .max(50, "Course code cannot exceed 50 characters"),
      courseName: z
        .string()
        .min(3, "Course name must be at least 3 characters")
        .max(255, "Course name cannot exceed 255 characters"),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().transform(Number),
    }),
    body: z.object({
      courseCode: z
        .string()
        .min(2, "Course code must be at least 2 characters")
        .max(50, "Course code cannot exceed 50 characters")
        .optional(),
      courseName: z
        .string()
        .min(3, "Course name must be at least 3 characters")
        .max(255, "Course name cannot exceed 255 characters")
        .optional(),
    }),
  }),
};
