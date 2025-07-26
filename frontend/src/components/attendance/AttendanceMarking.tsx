import { useState, useEffect } from "react";
import { Check, X, UserCheck, UserX } from "lucide-react";
import { attendanceApi } from "../../api/attendance";
import { studentApi } from "../../api/students";
import type { Student } from "../../types/student";
import type {
  AttendanceWithStudent,
  AttendanceStatus,
  BulkAttendanceData,
} from "../../types/attendance";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";

interface AttendanceMarkingProps {
  timetableId: number;
  courseId: number;
  date: string;
  onClose: () => void;
}

export const AttendanceMarking = ({
  timetableId,
  courseId,
  date,
  onClose,
}: AttendanceMarkingProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<
    Record<number, AttendanceStatus>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [timetableId, date]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load students and existing attendance
      const [studentsData, attendanceData] = await Promise.all([
        studentApi.getStudentsByCourse(courseId),
        attendanceApi.getClassAttendance(timetableId, date),
      ]);

      setStudents(studentsData);

      // Initialize attendance state from existing data
      const attendanceMap: Record<number, AttendanceStatus> = {};
      attendanceData.forEach((record) => {
        attendanceMap[record.studentId] = record.status;
      });

      // Set default status for students without attendance
      studentsData.forEach((student) => {
        if (!attendanceMap[student.id]) {
          attendanceMap[student.id] = "present";
        }
      });

      setAttendance(attendanceMap);
    } catch (err) {
      setError("Failed to load attendance data");
      console.error("Error loading attendance data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAttendance = (studentId: number) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newAttendance: Record<number, AttendanceStatus> = {};
    students.forEach((student) => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const data: BulkAttendanceData = {
        timetableId,
        date,
        attendance: Object.entries(attendance).map(([studentId, status]) => ({
          studentId: Number(studentId),
          status,
        })),
      };

      await attendanceApi.markBulkAttendance(data);
      onClose();
    } catch (err) {
      setError("Failed to save attendance");
      console.error("Error saving attendance:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner className="m-8" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Mark Attendance</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => handleMarkAll("present")}
            className="flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll("absent")}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
          >
            <UserX className="w-4 h-4 mr-2" />
            Mark All Absent
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.studentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleToggleAttendance(student.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      attendance[student.id] === "present"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {attendance[student.id] === "present" ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Present
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Absent
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSaving ? (
            <LoadingSpinner size="sm" className="mx-4" />
          ) : (
            "Save Attendance"
          )}
        </button>
      </div>
    </div>
  );
};
