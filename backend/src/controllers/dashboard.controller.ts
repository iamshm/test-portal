import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Student {
  id: number;
}

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  students: Student[];
  timetable: {
    attendance: {
      status: string;
    }[];
  }[];
}

interface TimetableEntry {
  id: number;
  startTime: string;
  endTime: string;
  course: {
    students: { id: number }[];
  };
}

type MonthlyData = {
  [date: string]: {
    total: number;
    present: number;
  };
};

export const dashboardController = {
  async getTodaySchedule(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const schedule = await prisma.timetable.findMany({
        where: {
          facultyId: userId,
          dayOfWeek: today,
        },
        include: {
          course: {
            include: {
              students: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
      });

      const enrichedSchedule = (schedule as TimetableEntry[]).map((entry) => ({
        ...entry,
        studentCount: entry.course.students.length,
        isCurrent:
          entry.startTime <= currentTime && entry.endTime >= currentTime,
        isUpcoming: entry.startTime > currentTime,
      }));

      res.json(enrichedSchedule);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  },

  async getQuickStats(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      const coursesCount = await prisma.course.count({
        where: { facultyId: userId },
      });

      const courses = (await prisma.course.findMany({
        where: { facultyId: userId },
        include: {
          students: true,
          timetable: {
            include: {
              attendance: true,
            },
          },
        },
      })) as Course[];

      let totalStudents = 0;
      let totalAttendance = 0;
      let totalSessions = 0;

      for (const course of courses) {
        totalStudents += course.students.length;

        for (const session of course.timetable) {
          const presentCount = session.attendance.filter(
            (record) => record.status === "present"
          ).length;
          totalAttendance += presentCount;
          totalSessions += session.attendance.length;
        }
      }

      const averageAttendance =
        totalSessions > 0 ? (totalAttendance / totalSessions) * 100 : 0;

      const recentAttendance = await prisma.attendance.findMany({
        where: {
          timetable: {
            facultyId: userId,
          },
        },
        include: {
          student: true,
          timetable: {
            include: {
              course: true,
            },
          },
        },
        orderBy: {
          markedAt: "desc",
        },
        take: 5,
      });

      res.json({
        coursesCount,
        totalStudents,
        averageAttendance: Math.round(averageAttendance),
        recentActivity: recentAttendance,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  },

  async getAttendanceOverview(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { month, year } = req.query;

      const courses = (await prisma.course.findMany({
        where: { facultyId: userId },
        include: {
          timetable: {
            include: {
              attendance: true,
            },
          },
        },
      })) as Course[];

      const courseComparison = courses.map((course) => {
        let totalAttendance = 0;
        let totalSessions = 0;

        for (const session of course.timetable) {
          const presentCount = session.attendance.filter(
            (record) => record.status === "present"
          ).length;
          totalAttendance += presentCount;
          totalSessions += session.attendance.length;
        }

        return {
          courseCode: course.courseCode,
          courseName: course.courseName,
          attendanceRate:
            totalSessions > 0
              ? Math.round((totalAttendance / totalSessions) * 100)
              : 0,
        };
      });

      let monthlyData: MonthlyData | null = null;
      if (month && year) {
        const startDate = new Date(Number(year), Number(month) - 1, 1);
        const endDate = new Date(Number(year), Number(month), 0);

        const monthlyAttendance = await prisma.attendance.findMany({
          where: {
            timetable: {
              facultyId: userId,
            },
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            timetable: {
              include: {
                course: true,
              },
            },
          },
        });

        monthlyData = {};
        for (const record of monthlyAttendance) {
          const date = record.date.toISOString().split("T")[0];
          if (!monthlyData[date]) {
            monthlyData[date] = { total: 0, present: 0 };
          }
          monthlyData[date].total++;
          if (record.status === "present") {
            monthlyData[date].present++;
          }
        }
      }

      res.json({
        courseComparison,
        monthlyData,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance overview" });
    }
  },
};
