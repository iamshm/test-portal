import { BaseService } from "./base.service";
import { AppError } from "../middleware/error.middleware";

export interface CreateStudentData {
  studentId: string;
  name: string;
  email?: string | null;
  courseId: number;
}

export interface UpdateStudentData {
  studentId?: string;
  name?: string;
  email?: string | null;
  courseId?: number;
}

export interface StudentWithCourse {
  id: number;
  studentId: string;
  name: string;
  email: string | null;
  courseId: number;
  createdAt: Date;
  course: {
    courseCode: string;
    courseName: string;
  };
}

export class StudentService extends BaseService {
  constructor() {
    super("student");
  }

  async getAllStudents(): Promise<StudentWithCourse[]> {
    try {
      return await this.prisma.student.findMany({
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
      throw new AppError(500, "Error fetching students");
    }
  }

  async getStudentById(id: number): Promise<StudentWithCourse> {
    try {
      const student = await this.prisma.student.findUnique({
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

      if (!student) {
        throw new AppError(404, "Student not found");
      }

      return student;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error fetching student");
    }
  }

  async createStudent(data: CreateStudentData): Promise<StudentWithCourse> {
    try {
      // Check if course exists
      const course = await this.prisma.course.findUnique({
        where: { id: data.courseId },
      });

      if (!course) {
        throw new AppError(404, "Course not found");
      }

      // Check if student ID is unique
      const existingStudent = await this.prisma.student.findFirst({
        where: { studentId: data.studentId },
      });

      if (existingStudent) {
        throw new AppError(400, "Student ID already exists");
      }

      return await this.prisma.student.create({
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
      throw new AppError(500, "Error creating student");
    }
  }

  async updateStudent(
    id: number,
    data: UpdateStudentData
  ): Promise<StudentWithCourse> {
    try {
      // Check if course exists if courseId is provided
      if (data.courseId) {
        const course = await this.prisma.course.findUnique({
          where: { id: data.courseId },
        });

        if (!course) {
          throw new AppError(404, "Course not found");
        }
      }

      // Check if student ID is unique if it's being updated
      if (data.studentId) {
        const existingStudent = await this.prisma.student.findFirst({
          where: {
            studentId: data.studentId,
            NOT: { id },
          },
        });

        if (existingStudent) {
          throw new AppError(400, "Student ID already exists");
        }
      }

      return await this.prisma.student.update({
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
      throw new AppError(500, "Error updating student");
    }
  }

  async deleteStudent(id: number): Promise<void> {
    try {
      await this.prisma.student.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError(500, "Error deleting student");
    }
  }

  async getStudentsByCourse(courseId: number): Promise<StudentWithCourse[]> {
    try {
      return await this.prisma.student.findMany({
        where: { courseId },
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
      throw new AppError(500, "Error fetching course students");
    }
  }

  async getStudentAttendance(id: number) {
    try {
      return await this.prisma.attendance.findMany({
        where: { studentId: id },
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
    } catch (error) {
      throw new AppError(500, "Error fetching student attendance");
    }
  }
}
