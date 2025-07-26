import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.attendance.deleteMany();
  await prisma.student.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create sample faculty accounts
  const faculty1 = await prisma.user.create({
    data: {
      email: "john.doe@faculty.com",
      password: await bcrypt.hash("password123", 10),
      name: "John Doe",
    },
  });

  const faculty2 = await prisma.user.create({
    data: {
      email: "jane.smith@faculty.com",
      password: await bcrypt.hash("password123", 10),
      name: "Jane Smith",
    },
  });

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      facultyId: faculty1.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      courseCode: "CS201",
      courseName: "Data Structures",
      facultyId: faculty1.id,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      courseCode: "MATH101",
      courseName: "Calculus I",
      facultyId: faculty2.id,
    },
  });

  // Create students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        studentId: "STU001",
        name: "Alice Johnson",
        email: "alice@student.com",
        courseId: course1.id,
      },
    }),
    prisma.student.create({
      data: {
        studentId: "STU002",
        name: "Bob Wilson",
        email: "bob@student.com",
        courseId: course1.id,
      },
    }),
    prisma.student.create({
      data: {
        studentId: "STU003",
        name: "Charlie Brown",
        email: "charlie@student.com",
        courseId: course2.id,
      },
    }),
    prisma.student.create({
      data: {
        studentId: "STU004",
        name: "Diana Prince",
        email: "diana@student.com",
        courseId: course3.id,
      },
    }),
  ]);

  // Create timetable entries
  const timetable1 = await prisma.timetable.create({
    data: {
      facultyId: faculty1.id,
      courseId: course1.id,
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      venue: "Room 101",
    },
  });

  const timetable2 = await prisma.timetable.create({
    data: {
      facultyId: faculty1.id,
      courseId: course2.id,
      dayOfWeek: "Wednesday",
      startTime: "11:00",
      endTime: "12:30",
      venue: "Room 102",
    },
  });

  const timetable3 = await prisma.timetable.create({
    data: {
      facultyId: faculty2.id,
      courseId: course3.id,
      dayOfWeek: "Tuesday",
      startTime: "14:00",
      endTime: "15:30",
      venue: "Room 201",
    },
  });

  // Create sample attendance records
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await Promise.all([
    // Today's attendance for CS101
    ...students
      .filter((student) => student.courseId === course1.id)
      .map((student) =>
        prisma.attendance.create({
          data: {
            studentId: student.id,
            timetableId: timetable1.id,
            date: today,
            status: Math.random() > 0.2 ? "present" : "absent",
          },
        })
      ),
    // Yesterday's attendance for CS201
    ...students
      .filter((student) => student.courseId === course2.id)
      .map((student) =>
        prisma.attendance.create({
          data: {
            studentId: student.id,
            timetableId: timetable2.id,
            date: yesterday,
            status: Math.random() > 0.2 ? "present" : "absent",
          },
        })
      ),
  ]);

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
