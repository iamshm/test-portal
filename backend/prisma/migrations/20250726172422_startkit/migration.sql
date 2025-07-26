-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "course_code" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "faculty_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "course_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable" (
    "id" SERIAL NOT NULL,
    "faculty_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "day_of_week" VARCHAR(10) NOT NULL,
    "start_time" VARCHAR(5) NOT NULL,
    "end_time" VARCHAR(5) NOT NULL,
    "venue" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "timetable_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'present',
    "marked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "courses_faculty_id_idx" ON "courses"("faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_student_id_key" ON "students"("student_id");

-- CreateIndex
CREATE INDEX "students_course_id_idx" ON "students"("course_id");

-- CreateIndex
CREATE INDEX "timetable_faculty_id_idx" ON "timetable"("faculty_id");

-- CreateIndex
CREATE INDEX "timetable_course_id_idx" ON "timetable"("course_id");

-- CreateIndex
CREATE INDEX "attendance_student_id_idx" ON "attendance"("student_id");

-- CreateIndex
CREATE INDEX "attendance_timetable_id_idx" ON "attendance"("timetable_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_student_id_timetable_id_date_key" ON "attendance"("student_id", "timetable_id", "date");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_timetable_id_fkey" FOREIGN KEY ("timetable_id") REFERENCES "timetable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
