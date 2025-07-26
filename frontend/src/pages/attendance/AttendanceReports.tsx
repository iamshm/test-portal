import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { format, subDays } from "date-fns";
import { attendanceApi } from "../../api/attendance";
import { courseApi } from "../../api/courses";
import { studentApi } from "../../api/students";
import type { CourseWithStudentCount } from "../../types/course";
import type { Student } from "../../types/student";
import type {
  ClassAttendanceSummary,
  StudentAttendanceSummary,
} from "../../types/attendance";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { AttendanceStats } from "../../components/attendance/AttendanceStats";
import { StudentAttendanceTable } from "../../components/attendance/StudentAttendanceTable";

export const AttendanceReports = () => {
  const [courses, setCourses] = useState<CourseWithStudentCount[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [courseSummary, setCourseSummary] =
    useState<ClassAttendanceSummary | null>(null);
  const [studentSummary, setStudentSummary] =
    useState<StudentAttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadStudents();
      loadCourseSummary();
    }
  }, [selectedCourse, dateRange]);

  useEffect(() => {
    if (selectedStudent && selectedCourse) {
      loadStudentSummary();
    }
  }, [selectedStudent, dateRange]);

  const loadCourses = async () => {
    try {
      const coursesData = await courseApi.getAllCourses();
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading courses:", err);
    }
  };

  const loadStudents = async () => {
    if (!selectedCourse) return;

    try {
      const studentsData = await studentApi.getStudentsByCourse(
        Number(selectedCourse)
      );
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load students");
      console.error("Error loading students:", err);
    }
  };

  const loadCourseSummary = async () => {
    if (!selectedCourse) return;

    try {
      setIsLoading(true);
      const summaryData = await attendanceApi.getCourseAttendanceSummary(
        Number(selectedCourse),
        dateRange.startDate,
        dateRange.endDate
      );
      setCourseSummary(summaryData[0] || null);
    } catch (err) {
      setError("Failed to load course summary");
      console.error("Error loading course summary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentSummary = async () => {
    if (!selectedStudent || !selectedCourse) return;

    try {
      setIsLoading(true);
      const summaryData = await attendanceApi.getStudentAttendance(
        Number(selectedStudent),
        Number(selectedCourse),
        dateRange.startDate,
        dateRange.endDate
      );
      setStudentSummary(summaryData);
    } catch (err) {
      setError("Failed to load student summary");
      console.error("Error loading student summary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement CSV export
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Attendance Reports
        </h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-700"
          >
            Course
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSelectedStudent("");
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id.toString()}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="student"
            className="block text-sm font-medium text-gray-700"
          >
            Student
          </label>
          <select
            id="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            disabled={!selectedCourse}
          >
            <option value="">All Students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id.toString()}>
                {student.studentId} - {student.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner className="mt-8" />
      ) : (
        <>
          {courseSummary && <AttendanceStats summary={courseSummary} />}
          {studentSummary && (
            <StudentAttendanceTable summary={studentSummary} />
          )}
        </>
      )}
    </div>
  );
};
