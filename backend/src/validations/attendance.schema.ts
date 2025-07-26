import { z } from "zod";

export const attendanceSchema = {
  markBulk: z.object({
    timetableId: z.number(),
    date: z.string(),
    attendance: z.array(
      z.object({
        studentId: z.number(),
        status: z.enum(["present", "absent"]),
      })
    ),
  }),

  update: z.object({
    status: z.enum(["present", "absent"]),
  }),
};
