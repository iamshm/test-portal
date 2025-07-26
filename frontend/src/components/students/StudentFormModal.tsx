import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import type { Student, CreateStudentData } from "../../types/student";
import type { CourseWithStudentCount } from "../../types/course";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentData) => Promise<void>;
  student?: Student;
  courses: CourseWithStudentCount[];
  title: string;
}

export const StudentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  student,
  courses,
  title,
}: StudentFormModalProps) => {
  const [formData, setFormData] = useState<CreateStudentData>({
    studentId: "",
    name: "",
    email: "",
    courseId: courses[0]?.id || 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.studentId,
        name: student.name,
        email: student.email || "",
        courseId: student.courseId,
      });
    } else {
      setFormData({
        studentId: "",
        name: "",
        email: "",
        courseId: courses[0]?.id || 0,
      });
    }
  }, [student, courses]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save student");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative bg-white rounded-lg w-full max-w-md">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && <ErrorMessage message={error} />}

            <div>
              <label
                htmlFor="studentId"
                className="block text-sm font-medium text-gray-700"
              >
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="courseId"
                className="block text-sm font-medium text-gray-700"
              >
                Course
              </label>
              <select
                id="courseId"
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: Number(e.target.value) })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="mx-4" />
                ) : student ? (
                  "Update Student"
                ) : (
                  "Create Student"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
