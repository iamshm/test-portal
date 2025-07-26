import { X } from "lucide-react";
import { AttendanceMarking } from "./AttendanceMarking";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetableId: number;
  courseId: number;
  date: string;
}

export const AttendanceModal = ({
  isOpen,
  onClose,
  timetableId,
  courseId,
  date,
}: AttendanceModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative bg-white rounded-lg w-full max-w-4xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Attendance</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <AttendanceMarking
              timetableId={timetableId}
              courseId={courseId}
              date={date}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
