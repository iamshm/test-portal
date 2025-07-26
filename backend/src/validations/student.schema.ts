import { z } from "zod";

export const studentSchema = {
  create: z.object({
    body: z.object({
      studentId: z
        .string()
        .min(2, "Student ID must be at least 2 characters")
        .max(50, "Student ID cannot exceed 50 characters"),
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(255, "Name cannot exceed 255 characters"),
      email: z.string().email("Invalid email format").optional().nullable(),
      courseId: z
        .number()
        .int("Course ID must be an integer")
        .positive("Course ID must be positive"),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().transform(Number),
    }),
    body: z.object({
      studentId: z
        .string()
        .min(2, "Student ID must be at least 2 characters")
        .max(50, "Student ID cannot exceed 50 characters")
        .optional(),
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(255, "Name cannot exceed 255 characters")
        .optional(),
      email: z.string().email("Invalid email format").optional().nullable(),
      courseId: z
        .number()
        .int("Course ID must be an integer")
        .positive("Course ID must be positive")
        .optional(),
    }),
  }),
};
