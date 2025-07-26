import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface TimetableEntry {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue: string;
  course: {
    courseCode: string;
    courseName: string;
  };
}

export const ClassSelection: React.FC = () => {
  const [todayClasses, setTodayClasses] = useState<TimetableEntry[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/timetable/my-schedule");

      // Get today's day name
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

      // Filter classes for today and upcoming
      const classes = response.data;
      setTodayClasses(
        classes.filter((c: TimetableEntry) => c.dayOfWeek === today)
      );
      setUpcomingClasses(
        classes.filter((c: TimetableEntry) => c.dayOfWeek !== today)
      );
    } catch (error) {
      console.error("Failed to fetch classes:", error);
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
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
        <div className="grid gap-4">
          {todayClasses.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{entry.course.courseCode}</h3>
                <p className="text-gray-600">{entry.course.courseName}</p>
                <p className="text-sm text-gray-500">
                  {entry.startTime} - {entry.endTime} | {entry.venue}
                </p>
              </div>
              <button
                onClick={() => markAttendance(entry.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Mark Attendance
              </button>
            </div>
          ))}
          {todayClasses.length === 0 && (
            <p className="text-gray-500">No classes scheduled for today</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
        <div className="grid gap-4">
          {upcomingClasses.map((entry) => (
            <div key={entry.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium">{entry.course.courseCode}</h3>
              <p className="text-gray-600">{entry.course.courseName}</p>
              <p className="text-sm text-gray-500">
                {entry.dayOfWeek} | {entry.startTime} - {entry.endTime} |{" "}
                {entry.venue}
              </p>
            </div>
          ))}
          {upcomingClasses.length === 0 && (
            <p className="text-gray-500">No upcoming classes</p>
          )}
        </div>
      </div>
    </div>
  );
};
