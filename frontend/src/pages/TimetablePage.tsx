import React, { useState, useEffect } from "react";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { SkeletonTable } from "../components/ui/Skeleton";
import { useToast } from "../contexts/ToastContext";

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

export const TimetablePage: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/timetable/my-schedule");
      if (!response.ok) throw new Error("Failed to fetch timetable");
      const data = await response.json();
      setTimetable(data);
    } catch (error) {
      showToast("error", "Failed to load timetable");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEntry = async (
    entryId: number,
    updates: Partial<TimetableEntry>
  ) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/timetable/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update timetable");

      await fetchTimetable(); // Refresh data
      showToast("success", "Timetable updated successfully");
    } catch (error) {
      showToast("error", "Failed to update timetable");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: number) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/timetable/${entryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete entry");

      await fetchTimetable(); // Refresh data
      showToast("success", "Entry deleted successfully");
    } catch (error) {
      showToast("error", "Failed to delete entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Weekly Timetable</h1>
        <SkeletonTable rows={5} columns={4} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Weekly Timetable</h1>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner size="large" color="white" />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timetable.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.dayOfWeek}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.startTime} - {entry.endTime}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.course.courseCode}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.course.courseName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.venue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() =>
                      handleUpdateEntry(entry.id, { venue: "New Venue" })
                    }
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    disabled={isSubmitting}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {timetable.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No timetable entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
