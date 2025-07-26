import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StudentController {
  // Get all students
  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await prisma.student.findMany({
        include: {
          course: {
            select: {
              courseCode: true,
              courseName: true,
            },
          },
        },
      });
      res.json({ students });
    } catch (error) {
      next(error);
    }
  }

  // Get students by course
  async getStudentsByCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const students = await prisma.student.findMany({
        where: { courseId: parseInt(courseId) },
        include: {
          course: {
            select: {
              courseCode: true,
              courseName: true,
            },
          },
        },
      });
      res.json({ students });
    } catch (error) {
      next(error);
    }
  }

  // Add new student
  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, name, email, courseId } = req.body;

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: parseInt(courseId) },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Check if student ID is unique
      const existingStudent = await prisma.student.findFirst({
        where: { studentId },
      });

      if (existingStudent) {
        return res.status(400).json({ error: "Student ID already exists" });
      }

      const student = await prisma.student.create({
        data: {
          studentId,
          name,
          email,
          courseId: parseInt(courseId),
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

      res.status(201).json({ student });
    } catch (error) {
      next(error);
    }
  }

  // Update student info
  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { studentId, name, email, courseId } = req.body;

      // Check if student exists
      const existingStudent = await prisma.student.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingStudent) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if course exists if courseId is provided
      if (courseId) {
        const course = await prisma.course.findUnique({
          where: { id: parseInt(courseId) },
        });

        if (!course) {
          return res.status(404).json({ error: "Course not found" });
        }
      }

      // Check if new student ID is unique
      if (studentId && studentId !== existingStudent.studentId) {
        const duplicateStudent = await prisma.student.findFirst({
          where: { studentId },
        });

        if (duplicateStudent) {
          return res.status(400).json({ error: "Student ID already exists" });
        }
      }

      const student = await prisma.student.update({
        where: { id: parseInt(id) },
        data: {
          studentId,
          name,
          email,
          courseId: courseId ? parseInt(courseId) : undefined,
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

      res.json({ student });
    } catch (error) {
      next(error);
    }
  }

  // Remove student
  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check if student exists
      const student = await prisma.student.findUnique({
        where: { id: parseInt(id) },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      await prisma.student.delete({
        where: { id: parseInt(id) },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
