import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import axios from "axios";

interface TimetableEntry {
  id: number;
  courseId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue: string | null;
  course: {
    courseCode: string;
    courseName: string;
  };
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export const TimetableView = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<TimetableEntry[]>(
        "/api/timetable/my-schedule"
      );
      if (Array.isArray(response.data)) {
        setTimetable(response.data);
      } else {
        setError("Invalid data format received from server");
        console.error("Expected array but got:", response.data);
      }
    } catch (err) {
      setError("Failed to load timetable");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    // TODO: Implement edit functionality
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/timetable/${id}`);
      setTimetable(timetable.filter((entry) => entry.id !== id));
    } catch (err) {
      setError("Failed to delete class");
      console.error(err);
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Extract HH:mm from time string
  };

  const getEntryForSlot = (day: string, timeSlot: string) => {
    if (!Array.isArray(timetable)) {
      console.error("Timetable is not an array:", timetable);
      return undefined;
    }
    return timetable.find((entry: TimetableEntry) => {
      return (
        entry.dayOfWeek === day &&
        entry.startTime <= timeSlot &&
        entry.endTime > timeSlot
      );
    });
  };

  const handleClick = (entry: TimetableEntry) => {
    const details = `
      Course: ${entry.course.courseCode} - ${entry.course.courseName}
      Time: ${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}
      Day: ${entry.dayOfWeek}
      ${entry.venue ? `Venue: ${entry.venue}` : ""}
    `;
    alert(details);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading timetable...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!Array.isArray(timetable)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Invalid timetable data</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Weekly Timetable</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Add Class
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b">
          <div className="p-3 font-medium text-gray-500 bg-gray-50">Time</div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="p-3 font-medium text-gray-900 bg-gray-50 border-l"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        {TIME_SLOTS.map((time) => (
          <div
            key={time}
            className="grid grid-cols-[100px_repeat(5,1fr)] border-b"
          >
            <div className="p-3 text-sm text-gray-500">{time}</div>
            {DAYS.map((day) => {
              const entry = getEntryForSlot(day, time);
              const isStart = entry?.startTime === time;

              if (!entry || !isStart) {
                return <div key={`${day}-${time}`} className="p-3 border-l" />;
              }

              // Calculate duration in slots
              const startIndex = TIME_SLOTS.indexOf(entry.startTime);
              const endIndex = TIME_SLOTS.findIndex((t) => t >= entry.endTime);
              const duration = endIndex - startIndex;

              return (
                <div
                  key={`${day}-${time}`}
                  className="border-l bg-indigo-50 p-3 cursor-pointer hover:bg-indigo-100"
                  style={{ gridRow: `span ${duration}` }}
                  onClick={() => handleClick(entry)}
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {entry.course.courseCode}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(entry.startTime)} -{" "}
                      {formatTime(entry.endTime)}
                    </div>
                    {entry.venue && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {entry.venue}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
