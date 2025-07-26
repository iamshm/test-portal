import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOut, Calendar, Users, Upload } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    { name: "Timetable", href: "/timetable", icon: Calendar },
    { name: "Upload Timetable", href: "/upload-timetable", icon: Upload },
    { name: "Students", href: "/students", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-semibold">Faculty Portal</h1>
            <button
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Menu />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-indigo-600" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 md:hidden bg-white shadow">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold">Faculty Portal</h1>
          <button
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};
