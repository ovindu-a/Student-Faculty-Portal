import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import Scheduler from "./Scheduler";

// Simple Select Component
const Select = ({
  value,
  onValueChange,
  className = "",
  children
}: {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${className}`}
  >
    {children}
  </select>
);

// Simple Option Component
const SelectItem = ({
  value,
  children
}: {
  value: string;
  children: React.ReactNode;
}) => (
  <option value={value}>{children}</option>
);

interface AttendanceRecord {
  attendance_id: number;
  reg_number: string;
  timestamp: string;
  method: string;
  status: string;
  location: string;
  course_code?: string;
}

// Manual Attendance Component
const ManualAttendance = () => {
  const [regNumber, setRegNumber] = useState('');
  const [status, setStatus] = useState('present');
  const [courseCode, setCourseCode] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Fetch recent attendance records
    // This is a mock implementation - would be replaced with actual API call
    const mockRecords: AttendanceRecord[] = [
      {
        attendance_id: 1,
        reg_number: "S12345",
        timestamp: new Date().toISOString(),
        method: "manual",
        status: "present",
        location: "Lecture Hall A",
        course_code: "CS101"
      },
      {
        attendance_id: 2,
        reg_number: "S12346",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        method: "manual",
        status: "absent",
        location: "Lecture Hall B",
        course_code: "CS102"
      },
      {
        attendance_id: 3,
        reg_number: "S12347",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        method: "manual",
        status: "late",
        location: "Lab 3",
        course_code: "CS103"
      }
    ];
    
    setRecentRecords(mockRecords);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validation
    if (!regNumber || !courseCode || !location) {
      setMessage({ 
        type: 'error', 
        text: 'Please fill in all required fields.' 
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8006/attendance/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reg_number: regNumber,
          status,
          course_code: courseCode,
          location
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Attendance recorded successfully' });
        // Add the new record to recent records
        setRecentRecords([data.data, ...recentRecords]);
        // Reset form
        setRegNumber('');
        setStatus('present');
        setCourseCode('');
        setLocation('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to record attendance' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Error recording attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-900 text-white">
        <CardHeader className="bg-gray-900 pb-3 pt-5">
          <CardTitle>Manual Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="reg_number">
                Registration Number *
              </label>
              <Input
                id="reg_number"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. S12345"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="status">
                Status *
              </label>
              <Select value={status} onValueChange={setStatus} className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="course_code">
                Course Code *
              </label>
              <Input
                id="course_code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CS101"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300" htmlFor="location">
                Location *
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lecture Hall A"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            
            {message && (
              <div className={`p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-900/50 text-green-200 border border-green-700' 
                  : 'bg-red-900/50 text-red-200 border border-red-700'
              }`}>
                {message.text}
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Submitting...' : 'Record Attendance'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900 text-white">
        <CardHeader className="bg-gray-900 pb-3 pt-5">
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-medium">Reg #</th>
                  <th className="text-left py-3 px-4 font-medium">Course</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Location</th>
                  <th className="text-left py-3 px-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.length > 0 ? (
                  recentRecords.map((record) => (
                    <tr key={record.attendance_id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="py-3 px-4">{record.reg_number}</td>
                      <td className="py-3 px-4">{record.course_code}</td>
                      <td className="py-3 px-4 flex items-center">
                        {getStatusIcon(record.status)}
                        <span className="ml-2 capitalize">{record.status}</span>
                      </td>
                      <td className="py-3 px-4">{record.location}</td>
                      <td className="py-3 px-4 text-gray-400">{formatDate(record.timestamp)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No recent attendance records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Placeholder components for different sections
const Students = () => (
  <div className="flex flex-col h-full">
    <div className="mb-4">
      <h1 className="text-2xl font-bold tracking-tight">Student Management</h1>
      <p className="text-muted-foreground">Manage your students and track their progress</p>
    </div>
    <Tabs defaultValue="attendance" className="flex-1">
      <TabsList className="bg-gray-800 border-b border-gray-700">
        <TabsTrigger value="attendance" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">Attendance</TabsTrigger>
        <TabsTrigger value="students" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">Student List</TabsTrigger>
        <TabsTrigger value="reports" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="attendance" className="mt-6 flex-1">
        <ManualAttendance />
      </TabsContent>
      <TabsContent value="students" className="mt-6">
        <Card className="bg-gray-900 text-white">
          <CardHeader className="bg-gray-900 pb-3 pt-5">
            <CardTitle>Student List</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Student list and management functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports" className="mt-6">
        <Card className="bg-gray-900 text-white">
          <CardHeader className="bg-gray-900 pb-3 pt-5">
            <CardTitle>Attendance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Attendance reports and analytics will be implemented here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
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