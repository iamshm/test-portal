import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import type {
  Timetable,
  CreateTimetableData,
  DayOfWeek,
} from "../../types/timetable";
import type { CourseWithStudentCount } from "../../types/course";
import { DAYS_OF_WEEK } from "../../types/timetable";
import { generateTimeSlots, formatTime } from "../../utils/timetable";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";

interface TimetableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTimetableData) => Promise<void>;
  timetable?: Timetable;
  courses: CourseWithStudentCount[];
  title: string;
}

export const TimetableFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  timetable,
  courses,
  title,
}: TimetableFormModalProps) => {
  const [formData, setFormData] = useState<CreateTimetableData>({
    courseId: courses[0]?.id || 0,
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    venue: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (timetable) {
      setFormData({
        courseId: timetable.courseId,
        dayOfWeek: timetable.dayOfWeek,
        startTime: timetable.startTime,
        endTime: timetable.endTime,
        venue: timetable.venue || "",
      });
    } else {
      setFormData({
        courseId: courses[0]?.id || 0,
        dayOfWeek: "Monday",
        startTime: "09:00",
        endTime: "10:00",
        venue: "",
      });
    }
  }, [timetable, courses]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save timetable");
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

            <div>
              <label
                htmlFor="dayOfWeek"
                className="block text-sm font-medium text-gray-700"
              >
                Day
              </label>
              <select
                id="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dayOfWeek: e.target.value as DayOfWeek,
                  })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              >
                {DAYS_OF_WEEK.slice(0, 5).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <select
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <select
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  {timeSlots
                    .filter((time) => time > formData.startTime)
                    .map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="venue"
                className="block text-sm font-medium text-gray-700"
              >
                Venue
              </label>
              <input
                type="text"
                id="venue"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Room number or location"
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
                ) : timetable ? (
                  "Update Schedule"
                ) : (
                  "Schedule Class"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
