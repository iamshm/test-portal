export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string | null;
  courseId: number;
  createdAt: string;
}

export interface CreateStudentData {
  studentId: string;
  name: string;
  email?: string;
  courseId: number;
}

export interface UpdateStudentData extends CreateStudentData {
  id: number;
}

export interface StudentWithCourse extends Student {
  course: {
    courseCode: string;
    courseName: string;
  };
}

export interface StudentAttendance {
  id: number;
  date: string;
  status: "present" | "absent";
  timetableId: number;
}
