import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AttendanceService {
  async getClassAttendance(timetableId: number, date: string) {
    return prisma.attendance.findMany({
      where: {
        timetableId,
        date: new Date(date),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            studentId: true,
          },
        },
      },
    });
  }

  async markBulkAttendance(
    timetableId: number,
    date: string,
    records: { studentId: number; status: "present" | "absent" }[]
  ) {
    return prisma.$transaction(
      records.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_timetableId_date: {
              studentId: record.studentId,
              timetableId,
              date: new Date(date),
            },
          },
          update: {
            status: record.status,
          },
          create: {
            studentId: record.studentId,
            timetableId,
            date: new Date(date),
            status: record.status,
          },
        })
      )
    );
  }

  async getStudentAttendance(studentId: number, courseId: number) {
    return prisma.attendance.findMany({
      where: {
        studentId,
        timetable: {
          courseId,
        },
      },
      include: {
        timetable: {
          include: {
            course: {
              select: {
                courseCode: true,
                courseName: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  async getCourseAttendanceSummary(courseId: number) {
    const timetableEntries = await prisma.timetable.findMany({
      where: {
        courseId,
      },
      include: {
        attendance: {
          include: {
            student: true,
          },
        },
      },
    });

    const summary = {
      totalClasses: timetableEntries.length,
      studentAttendance: {} as Record<
        number,
        {
          total: number;
          present: number;
          name: string;
          studentId: string;
        }
      >,
    };

    for (const entry of timetableEntries) {
      for (const record of entry.attendance) {
        const { student, studentId, status } = record;
        if (!summary.studentAttendance[studentId]) {
          summary.studentAttendance[studentId] = {
            total: 0,
            present: 0,
            name: student.name,
            studentId: student.studentId,
          };
        }
        summary.studentAttendance[studentId].total++;
        if (status === "present") {
          summary.studentAttendance[studentId].present++;
        }
      }
    }

    return summary;
  }
}
