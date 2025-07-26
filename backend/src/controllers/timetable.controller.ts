import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extend Express Request type to include our user type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

interface CourseWithCount {
  id: number;
  courseCode: string;
  courseName: string;
  facultyId: number;
  _count: {
    students: number;
  };
}

export class TimetableController {
  // Get faculty's timetable
  async getMySchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const facultyId = req.user?.userId;
      if (!facultyId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const timetable = await prisma.timetable.findMany({
        where: { facultyId },
        include: {
          course: {
            select: {
              courseCode: true,
              courseName: true,
            },
          },
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      });

      res.json(timetable);
    } catch (error) {
      next(error);
    }
  }

  // Update timetable entry
  async updateEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { courseId, dayOfWeek, startTime, endTime, venue } = req.body;
      const facultyId = req.user?.userId;

      if (!facultyId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if entry exists and belongs to faculty
      const existingEntry = await prisma.timetable.findFirst({
        where: {
          id: parseInt(id),
          facultyId,
        },
      });

      if (!existingEntry) {
        return res.status(404).json({ error: "Timetable entry not found" });
      }

      // Check for time slot conflicts
      const conflicts = await prisma.timetable.findFirst({
        where: {
          facultyId,
          dayOfWeek,
          NOT: { id: parseInt(id) },
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
          ],
        },
      });

      if (conflicts) {
        return res
          .status(400)
          .json({ error: "Time slot conflicts with existing schedule" });
      }

      // Update entry
      const updatedEntry = await prisma.timetable.update({
        where: { id: parseInt(id) },
        data: {
          courseId,
          dayOfWeek,
          startTime,
          endTime,
          venue,
        },
        include: {
          course: {
            select: {
              courseCode: true,
              courseName: true,
            },
          },
        },
      });

      res.json(updatedEntry);
    } catch (error) {
      next(error);
    }
  }

  // Delete timetable entry
  async deleteEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const facultyId = req.user?.userId;

      if (!facultyId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if entry exists and belongs to faculty
      const existingEntry = await prisma.timetable.findFirst({
        where: {
          id: parseInt(id),
          facultyId,
        },
      });

      if (!existingEntry) {
        return res.status(404).json({ error: "Timetable entry not found" });
      }

      // Delete entry
      await prisma.timetable.delete({
        where: { id: parseInt(id) },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Get faculty's courses
  async getMyCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const facultyId = req.user?.userId;
      if (!facultyId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const courses = await prisma.course.findMany({
        where: { facultyId },
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      const coursesWithCount = courses.map((course: CourseWithCount) => ({
        ...course,
        studentCount: course._count.students,
      }));

      res.json(coursesWithCount);
    } catch (error) {
      next(error);
    }
  }
}
