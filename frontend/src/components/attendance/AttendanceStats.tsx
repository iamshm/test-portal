import { BarChart3, Users, UserCheck, UserX } from "lucide-react";
import type { ClassAttendanceSummary } from "../../types/attendance";

interface AttendanceStatsProps {
  summary: ClassAttendanceSummary;
}

export const AttendanceStats = ({ summary }: AttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
        <div className="bg-indigo-100 p-3 rounded-full">
          <Users className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Total Students</p>
          <p className="text-2xl font-semibold text-gray-900">
            {summary.totalStudents}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
        <div className="bg-green-100 p-3 rounded-full">
          <UserCheck className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Present</p>
          <p className="text-2xl font-semibold text-gray-900">
            {summary.presentCount}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
        <div className="bg-red-100 p-3 rounded-full">
          <UserX className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Absent</p>
          <p className="text-2xl font-semibold text-gray-900">
            {summary.absentCount}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
        <div className="bg-yellow-100 p-3 rounded-full">
          <BarChart3 className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
          <p className="text-2xl font-semibold text-gray-900">
            {summary.attendancePercentage}%
          </p>
        </div>
      </div>
    </div>
  );
};
