export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  facultyId: number;
  createdAt: string;
}

export interface CreateCourseData {
  courseCode: string;
  courseName: string;
}

export interface UpdateCourseData extends CreateCourseData {
  id: number;
}

export interface CourseWithStudentCount extends Course {
  studentCount: number;
}
