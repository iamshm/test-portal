import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  studentId: string;
}

interface AttendanceRecord {
  studentId: number;
  status: "present" | "absent";
}

export const AttendancePage: React.FC = () => {
  const { timetableId } = useParams<{ timetableId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassAttendance();
  }, [timetableId, date]);

  const fetchClassAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/attendance/class/${timetableId}/${date}`
      );

      // Initialize attendance records for all students
      const records = response.data.map((record: any) => ({
        studentId: record.student.id,
        status: record.status,
      }));

      setAttendance(records);
      setStudents(response.data.map((record: any) => record.student));
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId: number) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.studentId === studentId
          ? {
              ...record,
              status: record.status === "present" ? "absent" : "present",
            }
          : record
      )
    );
  };

  const markAllPresent = () => {
    setAttendance((prev) =>
      prev.map((record) => ({ ...record, status: "present" }))
    );
  };

  const markAllAbsent = () => {
    setAttendance((prev) =>
      prev.map((record) => ({ ...record, status: "absent" }))
    );
  };

  const saveAttendance = async () => {
    try {
      setLoading(true);
      await axios.post("/api/attendance/mark", {
        timetableId: parseInt(timetableId!),
        date,
        attendance,
      });
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      <div className="mb-4 space-x-4">
        <button
          onClick={markAllPresent}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Mark All Present
        </button>
        <button
          onClick={markAllAbsent}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Mark All Absent
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Student ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const record = attendance.find((r) => r.studentId === student.id);
              return (
                <tr key={student.id} className="border-t">
                  <td className="px-6 py-4">{student.studentId}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAttendance(student.id)}
                      className={`px-4 py-2 rounded ${
                        record?.status === "present"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record?.status === "present" ? "Present" : "Absent"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          onClick={saveAttendance}
          className="bg-blue-500 text-white px-6 py-2 rounded"
          disabled={loading}
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};
