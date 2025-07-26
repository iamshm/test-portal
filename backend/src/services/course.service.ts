import { BaseService } from "./base.service";
import { AppError } from "../middleware/error.middleware";

export interface CreateCourseData {
  courseCode: string;
  courseName: string;
  facultyId: number;
}

export interface UpdateCourseData {
  courseCode?: string;
  courseName?: string;
}

export interface CourseWithStudentCount {
  id: number;
  courseCode: string;
  courseName: string;
  facultyId: number;
  createdAt: Date;
  studentCount: number;
}

export class CourseService extends BaseService {
  constructor() {
    super("course");
  }

  async getAllCourses(): Promise<CourseWithStudentCount[]> {
    try {
      const courses = await this.prisma.course.findMany({
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      return courses.map((course: any) => ({
        ...course,
        studentCount: course._count.students,
      }));
    } catch (error) {
      throw new AppError(500, "Error fetching courses");
    }
  }

  async getCourseById(id: number): Promise<CourseWithStudentCount> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      if (!course) {
        throw new AppError(404, "Course not found");
      }

      return {
        ...course,
        studentCount: course._count.students,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error fetching course");
    }
  }

  async createCourse(data: CreateCourseData): Promise<CourseWithStudentCount> {
    try {
      const course = await this.prisma.course.create({
        data,
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      return {
        ...course,
        studentCount: course._count.students,
      };
    } catch (error) {
      throw new AppError(500, "Error creating course");
    }
  }

  async updateCourse(
    id: number,
    data: UpdateCourseData
  ): Promise<CourseWithStudentCount> {
    try {
      const course = await this.prisma.course.update({
        where: { id },
        data,
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      return {
        ...course,
        studentCount: course._count.students,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error updating course");
    }
  }

  async deleteCourse(id: number): Promise<void> {
    try {
      await this.prisma.course.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError(500, "Error deleting course");
    }
  }

  async getCoursesByFaculty(
    facultyId: number
  ): Promise<CourseWithStudentCount[]> {
    try {
      const courses = await this.prisma.course.findMany({
        where: { facultyId },
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      return courses.map((course: any) => ({
        ...course,
        studentCount: course._count.students,
      }));
    } catch (error) {
      throw new AppError(500, "Error fetching faculty courses");
    }
  }

  async getCourseStudents(id: number) {
    try {
      const students = await this.prisma.student.findMany({
        where: { courseId: id },
        include: {
          course: {
            select: {
              courseCode: true,
              courseName: true,
            },
          },
        },
      });

      return students;
    } catch (error) {
      throw new AppError(500, "Error fetching course students");
    }
  }
}
