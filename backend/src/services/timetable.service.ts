import { BaseService } from "./base.service";
import { AppError } from "../middleware/error.middleware";

export interface CreateTimetableData {
  courseId: number;
  facultyId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue?: string | null;
}

export interface UpdateTimetableData {
  courseId?: number;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  venue?: string | null;
}

export interface TimetableWithCourse {
  id: number;
  courseId: number;
  facultyId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue: string | null;
  createdAt: Date;
  course: {
    courseCode: string;
    courseName: string;
  };
}

export class TimetableService extends BaseService {
  private validDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  private timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  constructor() {
    super("timetable");
  }

  private validateTimetableData(
    data: Partial<CreateTimetableData | UpdateTimetableData>
  ) {
    if (data.dayOfWeek && !this.validDays.includes(data.dayOfWeek)) {
      throw new AppError(400, "Invalid day of week");
    }

    if (data.startTime && !this.timeRegex.test(data.startTime)) {
      throw new AppError(400, "Invalid start time format (HH:mm)");
    }

    if (data.endTime && !this.timeRegex.test(data.endTime)) {
      throw new AppError(400, "Invalid end time format (HH:mm)");
    }
  }

  async getFacultyTimetable(facultyId: number): Promise<TimetableWithCourse[]> {
    try {
      return await this.prisma.timetable.findMany({
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
    } catch (error) {
      throw new AppError(500, "Error fetching faculty timetable");
    }
  }

  async getCourseTimetable(courseId: number): Promise<TimetableWithCourse[]> {
    try {
      return await this.prisma.timetable.findMany({
        where: { courseId },
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
    } catch (error) {
      throw new AppError(500, "Error fetching course timetable");
    }
  }

  async getTimetableById(id: number): Promise<TimetableWithCourse> {
    try {
      const timetable = await this.prisma.timetable.findUnique({
        where: { id },
        include: {
          course: {
            select: {
              courseCode: true,
              courseName: true,
            },
          },
        },
      });

      if (!timetable) {
        throw new AppError(404, "Timetable entry not found");
      }

      return timetable;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error fetching timetable entry");
    }
  }

  async createTimetable(
    data: CreateTimetableData
  ): Promise<TimetableWithCourse> {
    try {
      // Validate timetable data
      this.validateTimetableData(data);

      // Check if course exists
      const course = await this.prisma.course.findUnique({
        where: { id: data.courseId },
      });

      if (!course) {
        throw new AppError(404, "Course not found");
      }

      // Check for time slot conflicts
      const conflicts = await this.checkTimeSlotConflicts(
        data.facultyId,
        data.dayOfWeek,
        data.startTime,
        data.endTime
      );

      if (conflicts) {
        throw new AppError(400, "Time slot conflicts with existing schedule");
      }

      return await this.prisma.timetable.create({
        data,
        include: {
          course: {
            select: {
              courseCode: true,
              courseName: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error creating timetable entry");
    }
  }

  async updateTimetable(
    id: number,
    data: UpdateTimetableData
  ): Promise<TimetableWithCourse> {
    try {
      // Validate timetable data
      this.validateTimetableData(data);

      // Check if course exists if courseId is provided
      if (data.courseId) {
        const course = await this.prisma.course.findUnique({
          where: { id: data.courseId },
        });

        if (!course) {
          throw new AppError(404, "Course not found");
        }
      }

      // Get current timetable entry
      const currentTimetable = await this.prisma.timetable.findUnique({
        where: { id },
      });

      if (!currentTimetable) {
        throw new AppError(404, "Timetable entry not found");
      }

      // Check for time slot conflicts if time is being updated
      if (data.dayOfWeek || data.startTime || data.endTime) {
        const conflicts = await this.checkTimeSlotConflicts(
          currentTimetable.facultyId,
          data.dayOfWeek || currentTimetable.dayOfWeek,
          data.startTime || currentTimetable.startTime,
          data.endTime || currentTimetable.endTime,
          id
        );

        if (conflicts) {
          throw new AppError(400, "Time slot conflicts with existing schedule");
        }
      }

      return await this.prisma.timetable.update({
        where: { id },
        data,
        include: {
          course: {
            select: {
              courseCode: true,
              courseName: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error updating timetable entry");
    }
  }

  async deleteTimetable(id: number): Promise<void> {
    try {
      await this.prisma.timetable.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError(500, "Error deleting timetable entry");
    }
  }

  async checkTimeSlotConflicts(
    facultyId: number,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    excludeTimetableId?: number
  ): Promise<boolean> {
    try {
      const where: any = {
        facultyId,
        dayOfWeek,
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
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      };

      if (excludeTimetableId) {
        where.NOT = { id: excludeTimetableId };
      }

      const conflicts = await this.prisma.timetable.findFirst({
        where,
      });

      return !!conflicts;
    } catch (error) {
      throw new AppError(500, "Error checking time slot conflicts");
    }
  }
}
