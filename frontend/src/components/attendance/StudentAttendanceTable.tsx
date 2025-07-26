import React from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface Student {
  id: number;
  studentId: string;
  name: string;
}

interface AttendanceRecord {
  studentId: number;
  status: "present" | "absent";
}

interface Props {
  students: Student[];
  attendance: AttendanceRecord[];
  onToggleAttendance: (studentId: number) => void;
  onMarkAll: (status: "present" | "absent") => void;
  onSave: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
}

export const StudentAttendanceTable: React.FC<Props> = ({
  students,
  attendance,
  onToggleAttendance,
  onMarkAll,
  onSave,
  isLoading = false,
  isSaving = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => onMarkAll("present")}
          disabled={isSaving}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Mark All Present
        </button>
        <button
          onClick={() => onMarkAll("absent")}
          disabled={isSaving}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Mark All Absent
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="ml-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <LoadingSpinner size="small" color="white" />
              <span>Saving...</span>
            </>
          ) : (
            "Save Attendance"
          )}
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => {
              const record = attendance.find((a) => a.studentId === student.id);
              const isPresent = record?.status === "present";

              return (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleAttendance(student.id)}
                      disabled={isSaving}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        isPresent
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } disabled:opacity-50`}
                    >
                      {isPresent ? "Present" : "Absent"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {students.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  No students found in this class
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
