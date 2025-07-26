export interface Attendance {
  id: number;
  studentId: number;
  timetableId: number;
  date: string;
  status: AttendanceStatus;
  markedAt: string;
}

export type AttendanceStatus = "present" | "absent";

export interface AttendanceWithStudent extends Attendance {
  student: {
    studentId: string;
    name: string;
  };
}

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  timetable: {
    startTime: string;
    endTime: string;
    course: {
      courseCode: string;
      courseName: string;
    };
  };
}

export interface StudentAttendanceSummary {
  studentId: string;
  name: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  records: AttendanceRecord[];
}

export interface ClassAttendanceSummary {
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
}

export interface MarkAttendanceData {
  studentId: number;
  status: AttendanceStatus;
}

export interface BulkAttendanceData {
  timetableId: number;
  date: string;
  attendance: MarkAttendanceData[];
}
