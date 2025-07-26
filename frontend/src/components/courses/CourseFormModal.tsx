import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import type { Course, CreateCourseData } from "../../types/course";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCourseData) => Promise<void>;
  course?: Course;
  title: string;
}

export const CourseFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  course,
  title,
}: CourseFormModalProps) => {
  const [formData, setFormData] = useState<CreateCourseData>({
    courseCode: "",
    courseName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setFormData({
        courseCode: course.courseCode,
        courseName: course.courseName,
      });
    } else {
      setFormData({
        courseCode: "",
        courseName: "",
      });
    }
  }, [course]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course");
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
                htmlFor="courseCode"
                className="block text-sm font-medium text-gray-700"
              >
                Course Code
              </label>
              <input
                type="text"
                id="courseCode"
                value={formData.courseCode}
                onChange={(e) =>
                  setFormData({ ...formData, courseCode: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="courseName"
                className="block text-sm font-medium text-gray-700"
              >
                Course Name
              </label>
              <input
                type="text"
                id="courseName"
                value={formData.courseName}
                onChange={(e) =>
                  setFormData({ ...formData, courseName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
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
                ) : course ? (
                  "Update Course"
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
