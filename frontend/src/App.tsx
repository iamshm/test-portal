import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { CourseList } from "./pages/courses/CourseList";
import { StudentList } from "./pages/students/StudentList";
import { TimetableView } from "./pages/timetable/TimetableView";
import { AttendanceReports } from "./pages/attendance/AttendanceReports";
import { UploadTimetable } from "./pages/timetable/UploadTimetable";
// import { AttendanceMarking } from "./pages/attendance/AttendanceMarking";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    {/* Dashboard */}
                    <Route path="/" element={<Dashboard />} />

                    {/* Courses */}
                    <Route path="courses" element={<CourseList />} />

                    {/* Students */}
                    <Route path="students" element={<StudentList />} />
                    <Route
                      path="students/course/:courseId"
                      element={<StudentList />}
                    />

                    {/* Timetable */}
                    <Route path="timetable" element={<TimetableView />} />
                    <Route
                      path="timetable/upload"
                      element={<UploadTimetable />}
                    />

                    {/* Attendance */}
                    {/* <Route path="attendance" element={<AttendanceMarking />} /> */}
                    <Route
                      path="attendance/reports"
                      element={<AttendanceReports />}
                    />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
