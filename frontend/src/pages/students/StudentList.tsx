import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { studentApi } from "../../api/students";
import { courseApi } from "../../api/courses";
import type { StudentWithCourse, CreateStudentData } from "../../types/student";
import type { CourseWithStudentCount } from "../../types/course";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorMessage } from "../../components/common/ErrorMessage";

export const StudentList = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState<StudentWithCourse[]>([]);
  const [courses, setCourses] = useState<CourseWithStudentCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState<CreateStudentData>({
    studentId: "",
    name: "",
    email: "",
    courseId: courseId ? parseInt(courseId) : 0,
  });

  useEffect(() => {
    fetchStudents();
    if (!courseId) {
      fetchCourses();
    }
  }, [courseId]);

  const fetchCourses = async () => {
    try {
      const coursesData = await courseApi.getAllCourses();
      setCourses(coursesData);
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let studentsData;
      if (courseId) {
        // Fetch students for specific course
        studentsData = await studentApi.getStudentsByCourse(parseInt(courseId));
      } else {
        // Fetch all students
        studentsData = await studentApi.getAllStudents();
      }
      
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load students");
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentApi.createStudent(newStudent);
      setNewStudent({ 
        studentId: "", 
        name: "", 
        email: "",
        courseId: courseId ? parseInt(courseId) : 0
      });
      fetchStudents();
    } catch (err) {
      setError("Failed to add student");
      console.error('Error creating student:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await studentApi.deleteStudent(id);
      setStudents(students.filter((student) => student.id !== id));
    } catch (err) {
      setError("Failed to delete student");
      console.error('Error deleting student:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Students</h1>

      {/* Add Student Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        {!courseId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <select
              value={newStudent.courseId}
              onChange={(e) =>
                setNewStudent({ ...newStudent, courseId: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value={0}>Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Student ID
          </label>
          <input
            type="text"
            value={newStudent.studentId}
            onChange={(e) =>
              setNewStudent({ ...newStudent, studentId: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Student
        </button>
      </form>

      {/* Student List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              {!courseId && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Course
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.studentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                {!courseId && student.course && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.course.courseCode} - {student.course.courseName}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
