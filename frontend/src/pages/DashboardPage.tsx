import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface TodaySchedule {
  id: number;
  startTime: string;
  endTime: string;
  venue: string;
  studentCount: number;
  isCurrent: boolean;
  isUpcoming: boolean;
  course: {
    courseCode: string;
    courseName: string;
  };
}

interface QuickStats {
  coursesCount: number;
  totalStudents: number;
  averageAttendance: number;
  recentActivity: Array<{
    student: {
      name: string;
      studentId: string;
    };
    status: string;
    date: string;
    timetable: {
      course: {
        courseCode: string;
      };
    };
  }>;
}

interface AttendanceOverview {
  courseComparison: Array<{
    courseCode: string;
    courseName: string;
    attendanceRate: number;
  }>;
  monthlyData: Record<string, { total: number; present: number }>;
}

export const DashboardPage: React.FC = () => {
  const [schedule, setSchedule] = useState<TodaySchedule[]>([]);
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [overview, setOverview] = useState<AttendanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [scheduleRes, statsRes, overviewRes] = await Promise.all([
        axios.get("/api/dashboard/schedule/today"),
        axios.get("/api/dashboard/stats"),
        axios.get("/api/dashboard/attendance/overview"),
      ]);

      setSchedule(scheduleRes.data);
      setStats(statsRes.data);
      setOverview(overviewRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (timetableId: number) => {
    navigate(`/attendance/${timetableId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Today's Schedule */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>
        <div className="grid gap-4">
          {schedule.map((entry) => (
            <div
              key={entry.id}
              className={`bg-white p-4 rounded-lg shadow ${
                entry.isCurrent ? "border-l-4 border-green-500" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{entry.course.courseCode}</h3>
                  <p className="text-gray-600">{entry.course.courseName}</p>
                  <p className="text-sm text-gray-500">
                    {entry.startTime} - {entry.endTime} | {entry.venue}
                  </p>
                  <p className="text-sm text-gray-500">
                    {entry.studentCount} students
                  </p>
                </div>
                <button
                  onClick={() => markAttendance(entry.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Mark Attendance
                </button>
              </div>
            </div>
          ))}
          {schedule.length === 0 && (
            <p className="text-gray-500">No classes scheduled for today</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Courses</h3>
            <p className="text-2xl font-bold">{stats?.coursesCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Total Students</h3>
            <p className="text-2xl font-bold">{stats?.totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Average Attendance</h3>
            <p className="text-2xl font-bold">{stats?.averageAttendance}%</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentActivity.map((activity, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-4">
                    {activity.student.name}
                    <br />
                    <span className="text-sm text-gray-500">
                      {activity.student.studentId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {activity.timetable.course.courseCode}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        activity.status === "present"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(activity.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Comparison */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Course Attendance</h2>
        <div className="grid gap-4">
          {overview?.courseComparison.map((course) => (
            <div
              key={course.courseCode}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{course.courseCode}</h3>
                  <p className="text-gray-600">{course.courseName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{course.attendanceRate}%</p>
                  <p className="text-sm text-gray-500">attendance rate</p>
                </div>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${course.attendanceRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
