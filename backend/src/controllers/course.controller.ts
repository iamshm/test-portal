import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller";
import { AppError } from "../middleware/error.middleware";

export class CourseController extends BaseController {
  constructor() {
    super("course");
  }

  getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await this.prisma.course.findMany({
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      const coursesWithCount = courses.map((course: any) => ({
        ...course,
        studentCount: course._count.students,
      }));

      res.json({ courses: coursesWithCount });
    } catch (error) {
      next(error);
    }
  };

  getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await this.prisma.course.findUnique({
        where: { id: Number(id) },
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      if (!course) {
        throw new AppError(404, "Course not found");
      }

      res.json({
        course: {
          ...course,
          studentCount: course._count.students,
        }
      });
    } catch (error) {
      next(error);
    }
  };

  createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseCode, courseName } = req.body;
      const facultyId = (req.user as any).id;

      const course = await this.prisma.course.create({
        data: {
          courseCode,
          courseName,
          facultyId,
        },
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      res.status(201).json({
        course: {
          ...course,
          studentCount: course._count.students,
        }
      });
    } catch (error) {
      next(error);
    }
  };

  updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { courseCode, courseName } = req.body;
      const facultyId = (req.user as any).id;

      const course = await this.prisma.course.update({
        where: { id: Number(id) },
        data: {
          courseCode,
          courseName,
        },
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      res.json({
        course: {
          ...course,
          studentCount: course._count.students,
        }
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCourse = this.delete;

  getCourseStudents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const students = await this.prisma.student.findMany({
        where: { courseId: Number(id) },
      });
      res.json(students);
    } catch (error) {
      next(error);
    }
  };
}
