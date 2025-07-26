import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { courseApi } from "../../api/courses";
import type {
  Course,
  CourseWithStudentCount,
  CreateCourseData,
} from "../../types/course";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { CourseFormModal } from "../../components/courses/CourseFormModal";

export const CourseList = () => {
  const [courses, setCourses] = useState<CourseWithStudentCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await courseApi.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async (data: CreateCourseData) => {
    try {
      const newCourse = await courseApi.createCourse(data);
      setCourses([...courses, { ...newCourse, studentCount: 0 }]);
    } catch (err) {
      throw new Error("Failed to create course");
    }
  };

  const handleUpdateCourse = async (data: CreateCourseData) => {
    if (!selectedCourse) return;

    try {
      const updatedCourse = await courseApi.updateCourse({
        ...data,
        id: selectedCourse.id,
      });
      setCourses(
        courses.map((course) =>
          course.id === updatedCourse.id
            ? { ...updatedCourse, studentCount: course.studentCount }
            : course
        )
      );
    } catch (err) {
      throw new Error("Failed to update course");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await courseApi.deleteCourse(id);
      setCourses(courses.filter((course) => course.id !== id));
    } catch (err) {
      setError("Failed to delete course");
      console.error("Error deleting course:", err);
    }
  };

  const openCreateModal = () => {
    setSelectedCourse(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner className="mt-8" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          onClick={openCreateModal}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Course
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No courses found. Create your first course to get started.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.courseCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.courseName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.studentCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(course)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={selectedCourse ? handleUpdateCourse : handleCreateCourse}
        course={selectedCourse}
        title={selectedCourse ? "Edit Course" : "Create Course"}
      />
    </div>
  );
};
