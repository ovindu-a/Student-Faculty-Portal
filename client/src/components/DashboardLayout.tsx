import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Book, User, Monitor, Calendar, Search, Cctv } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user info to get role
    fetch('http://localhost:8100/user', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setUserRole(data.role);
      })
      .catch(err => {
        console.error('Error fetching user info:', err);
      });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    {
      href: "/student-dashboard",
      icon: User,
      label: "Student Dashboard",
      isActive: location.pathname === "/student-dashboard",
      visible: userRole === 'Student'
    },
    {
      href: "/faculty-dashboard",
      icon: Monitor,
      label: "Faculty Dashboard",
      isActive: location.pathname === "/faculty-dashboard",
      visible: userRole === 'Faculty'
    },
    {
      href: "/surveilance",
      icon: Cctv,
      label: "Surveilance",
      isActive: location.pathname === "/surveilance",
      visible: userRole === "Admin"
    },
    {
      href: "/courses",
      icon: Book,
      label: "Courses",
      isActive: location.pathname === "/courses",
      visible: userRole === "Student"
    },
    {
      href: "/schedule",
      icon: Calendar,
      label: "Schedule",
      isActive: location.pathname === "/schedule",
      visible: userRole === "Student"
    },
    {
      href: "/announcements",
      icon: Search,
      label: "Announcements",
      isActive: location.pathname === "/announcements",
      visible: userRole === "Student"
    },
    {
      href: "/scheduler",
      icon: Search,
      label: "Scheduler",
      isActive: location.pathname === "/scheduler",
      visible: userRole === "Faculty"
    },
    {
      href: "/attendance",
      icon: Search,
      label: "Attendance",
      isActive: location.pathname === "/attendance",
      visible: userRole === "Student"
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside
        className={cn(
          "bg-white border-r transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold text-blue-600">Dashboard</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${
                isSidebarOpen ? "" : "transform rotate-180"
              }`}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {navItems.filter(item => item.visible).map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-md transition-colors",
                    item.isActive
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", item.isActive ? "text-blue-600" : "text-gray-500")} />
                  {isSidebarOpen && (
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 