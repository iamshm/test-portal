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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/courses" element={<CourseList />} />
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/timetable" element={<TimetableView />} />
                    <Route path="/attendance" element={<AttendanceReports />} />
                    <Route
                      path="/upload-timetable"
                      element={<UploadTimetable />}
                    />
                    <Route
                      path="/students/:courseId"
                      element={<StudentList />}
                    />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
