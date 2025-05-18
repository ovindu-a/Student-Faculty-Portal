import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Calendar, 
  GraduationCap, 
  Library, 
  User, 
  Users, 
  Book, 
  Menu, 
  X, 
  Shield,
  LogOut
} from "lucide-react";
import Scheduler from "./Scheduler";

// Placeholder components for different sections
const Students = () => (
  <div className="flex flex-col h-full">
    <div className="mb-4">
      <h1 className="text-2xl font-bold tracking-tight">Student Management</h1>
      <p className="text-muted-foreground">Manage your students and track their progress</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Student List</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Student list and management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const Assignments = () => (
  <div className="flex flex-col h-full">
    <div className="mb-4">
      <h1 className="text-2xl font-bold tracking-tight">Assignment Management</h1>
      <p className="text-muted-foreground">Create and grade assignments for your courses</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Assignment Center</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Assignment creation and grading will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const Grades = () => (
  <div className="flex flex-col h-full">
    <div className="mb-4">
      <h1 className="text-2xl font-bold tracking-tight">Grade Management</h1>
      <p className="text-muted-foreground">Manage grades for all your courses and students</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Grade Center</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Grade submission and management will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const CourseContent = () => (
  <div className="flex flex-col h-full">
    <div className="mb-4">
      <h1 className="text-2xl font-bold tracking-tight">Course Content</h1>
      <p className="text-muted-foreground">Manage and organize course materials</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Content Library</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Course content management will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("scheduler");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8100/user', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const userData = await response.json();
        console.log('User data fetched:', userData);
        
        if (userData.role !== 'Faculty') {
          console.log("Invalid role, redirecting to home");
          navigate('/');
          return;
        }
        
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };
    
    fetchUser();

    // Add event listener to handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  const navItems = [
    { id: 'scheduler', label: 'Class Schedule', icon: Calendar },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: Library },
    { id: 'grades', label: 'Grades', icon: GraduationCap },
    { id: 'courses', label: 'Course Content', icon: Book },
  ];

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
      case "courses":
        return <CourseContent />;
      default:
        return <Scheduler />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8100/logout', {
        method: 'GET',
        credentials: 'include',
      });
      
      // Regardless of response, redirect to login page
      navigate('/');
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, still redirect to login page
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen h-screen w-full bg-gray-50 overflow-hidden">
      {/* Top header bar for mobile - only shown on small screens */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Faculty Portal</h2>
        <button onClick={toggleSidebar} className="p-1">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden w-full h-full">
        {/* Left sidebar - responsive */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block bg-gray-900 text-white border-r flex-shrink-0 ${
          isSidebarOpen ? 'w-full md:w-64' : 'w-0'
        } transition-all duration-300 fixed md:static md:h-full z-20 h-[calc(100%-4rem)]`}>
          <div className="hidden md:block p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold">Faculty Portal</h2>
          </div>
          <nav className="mt-4 overflow-y-auto h-[calc(100%-8rem)]">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      if (window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left ${
                      activeSection === item.id 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Desktop user info and logout */}
          <div className="hidden md:block absolute bottom-0 w-64 border-t border-gray-800 p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center p-2 rounded-md">
                <Shield className="h-6 w-6 mr-3 text-blue-400" />
                <div className="flex flex-col">
                  <span className="font-semibold">Faculty User</span>
                  <span className="text-xs text-gray-400">{user?.email}</span>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-left text-red-400 hover:bg-gray-700 rounded-md"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
          
          {/* Mobile user info and logout */}
          <div className="md:hidden border-t border-gray-800 p-4 mt-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center p-2 rounded-md">
                <Shield className="h-6 w-6 mr-3 text-blue-400" />
                <div className="flex flex-col">
                  <span className="font-semibold">Faculty User</span>
                  <span className="text-xs text-gray-400">{user?.email}</span>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-left text-red-400 hover:bg-gray-700 rounded-md"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto w-full h-full p-2 md:p-4">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;