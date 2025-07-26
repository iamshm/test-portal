import { useAuth } from "../contexts/AuthContext";
import { BookOpen, Users, Calendar, Clock } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: typeof BookOpen;
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="p-3 bg-indigo-100 rounded-full">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuth();

  // Placeholder data - will be replaced with real data later
  const stats = [
    { title: "Total Courses", value: "5", icon: BookOpen },
    { title: "Total Students", value: "150", icon: Users },
    { title: "Classes Today", value: "3", icon: Calendar },
    { title: "Upcoming Class", value: "2:30 PM", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your classes today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-4">
            Activity data will be shown here
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Today's Schedule
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-4">
            Schedule data will be shown here
          </div>
        </div>
      </div>
    </div>
  );
};
