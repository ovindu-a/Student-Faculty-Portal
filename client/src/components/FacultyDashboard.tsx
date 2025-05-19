import React, { useEffect, useState } from 'react';
// import { Container, Typography, Box, Button, Avatar, Paper } from '@mui/material';
import { Container, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
// import { StudentEngagement } from "./StudentEngagement";
// import { DashboardLayout } from "./DashboardLayout";
// import { Badge } from "./ui/badge";
import { Calendar, GraduationCap, Library, User, Users } from "lucide-react";
// import { BookOpen, Calendar, GraduationCap, Library, Settings, User, Users } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar-trigger";
import Scheduler from "./Scheduler";

interface UserInfo {
  email: string;
  name: string;
  picture: string;
  role: string;
}

// const coursePerformanceData = [
//   { name: "Week 1", average: 82 },
//   { name: "Week 2", average: 78 },
//   { name: "Week 3", average: 83 },
//   { name: "Week 4", average: 76 },
//   { name: "Week 5", average: 80 },
// ];

// const riskDistributionData = [
//   { name: "Low Risk", value: 65, color: "#10b981" },
//   { name: "Medium Risk", value: 25, color: "#f59e0b" },
//   { name: "High Risk", value: 10, color: "#ef4444" },
// ];

// const participationData = [
//   { name: "Forum Posts", count: 245 },
//   { name: "Assignments", count: 180 },
//   { name: "Quizzes", count: 135 },
//   { name: "Live Sessions", count: 90 },
// ];

// const atRiskStudents = [
//   {
//     id: 1,
//     name: "Alex Johnson",
//     course: "Advanced Mathematics",
//     riskScore: 85,
//     lastActive: "3 days ago",
//   },
//   {
//     id: 2,
//     name: "Jamie Smith",
//     course: "Physics 101",
//     riskScore: 72,
//     lastActive: "5 days ago",
//   },
//   {
//     id: 3,
//     name: "Taylor Wilson",
//     course: "Data Science Fundamentals",
//     riskScore: 78,
//     lastActive: "4 days ago",
//   },
// ];

// Placeholder components for different sections

const Students = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Student Management</h2>
    <p>Student list and management will be implemented here.</p>
  </div>
);

const Assignments = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Assignment Management</h2>
    <p>Assignment creation and grading will be implemented here.</p>
  </div>
);

const Grades = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Grade Management</h2>
    <p>Grade submission and management will be implemented here.</p>
  </div>
);

const Profile = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Profile</h2>
    <p>Faculty profile and settings will be implemented here.</p>
  </div>
);

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [activeSection, setActiveSection] = useState("scheduler");

  useEffect(() => {
    // Fetch user info from backend
    fetch('http://localhost:8100/user', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("User data received:", data); // Debug log
        if (data.role !== 'Faculty') {  // Changed from 'faculty' to 'Faculty'
          console.log("Invalid role, redirecting to home"); // Debug log
          navigate('/');
        }
        setUserInfo(data);
      })
      .catch(err => {
        console.error('Error fetching user info:', err);
        navigate('/');
      });
  }, [navigate]);

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8100/logout');
  //     const data = await response.json();
  //     if (data.redirect) {
  //       window.location.href = data.redirect;
  //     }
  //   } catch (err) {
  //     console.error('Logout error:', err);
  //     navigate('/');
  //   }
  // };

  if (!userInfo) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "scheduler":
        return <Scheduler />;
      case "students":
        return <Students />;
      case "assignments":
        return <Assignments />;
      case "grades":
        return <Grades />;
      case "profile":
        return <Profile />;
      default:
        return <Scheduler />;
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <aside className="w-64 border-r border-border bg-background">
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveSection("scheduler")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
              activeSection === "scheduler"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>Scheduler</span>
          </button>
          <button
            onClick={() => setActiveSection("students")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
              activeSection === "students"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Students</span>
          </button>
          <button
            onClick={() => setActiveSection("assignments")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
              activeSection === "assignments"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Library className="h-5 w-5" />
            <span>Assignments</span>
          </button>
          <button
            onClick={() => setActiveSection("grades")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
              activeSection === "grades"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <GraduationCap className="h-5 w-5" />
            <span>Grades</span>
          </button>
          <button
            onClick={() => setActiveSection("profile")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
              activeSection === "profile"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="flex h-16 items-center gap-4 border-b border-border bg-background px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="ml-auto flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              {userInfo.name?.charAt(0) || 'F'}
            </div>
          </div>
        </div>
        <div className="container py-6">{renderActiveSection()}</div>
      </main>
    </div>
  );
};

export default FacultyDashboard; 