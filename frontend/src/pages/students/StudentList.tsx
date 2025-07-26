import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string | null;
  course: {
    courseCode: string;
    courseName: string;
  };
}

export const StudentList = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    studentId: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/students/by-course/${courseId}`);
      setStudents(response.data);
    } catch (err) {
      setError("Failed to load students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/students", {
        ...newStudent,
        courseId: parseInt(courseId!),
      });
      setNewStudent({ studentId: "", name: "", email: "" });
      fetchStudents();
    } catch (err) {
      setError("Failed to add student");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/students/${id}`);
      setStudents(students.filter((student) => student.id !== id));
    } catch (err) {
      setError("Failed to delete student");
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Students</h1>

      {/* Add Student Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
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
