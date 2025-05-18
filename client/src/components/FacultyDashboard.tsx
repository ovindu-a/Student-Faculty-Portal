"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Calendar,
  GraduationCap,
  Library,
  Users,
  Book,
  Menu,
  X,
  Shield,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Scheduler from "./Scheduler"
import ResourceManagement from "./ResourceManagement"

// Simple Select Component
const Select = ({
  value,
  onValueChange,
  className = "",
  children,
}: {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${className}`}
  >
    {children}
  </select>
)

// Simple Option Component
const SelectItem = ({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) => <option value={value}>{children}</option>

interface AttendanceRecord {
  attendance_id: number
  reg_number: string
  timestamp: string
  method: string
  status: string
  location: string
  course_code?: string
}

// Manual Attendance Component
const ManualAttendance = () => {
  const [regNumber, setRegNumber] = useState("")
  const [status, setStatus] = useState("present")
  const [courseCode, setCourseCode] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([])

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
        course_code: "CS101",
      },
      {
        attendance_id: 2,
        reg_number: "S12346",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        method: "manual",
        status: "absent",
        location: "Lecture Hall B",
        course_code: "CS102",
      },
      {
        attendance_id: 3,
        reg_number: "S12347",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        method: "manual",
        status: "late",
        location: "Lab 3",
        course_code: "CS103",
      },
    ]

    setRecentRecords(mockRecords)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Validation
    if (!regNumber || !courseCode || !location) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8006/attendance/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reg_number: regNumber,
          status,
          course_code: courseCode,
          location,
        }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: data.message || "Attendance recorded successfully" })
        // Add the new record to recent records
        setRecentRecords([data.data, ...recentRecords])
        // Reset form
        setRegNumber("")
        setStatus("present")
        setCourseCode("")
        setLocation("")
      } else {
        setMessage({ type: "error", text: data.message || "Failed to record attendance" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." })
      console.error("Error recording attendance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "late":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

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
              <div
                className={`p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-900/50 text-green-200 border border-green-700"
                    : "bg-red-900/50 text-red-200 border border-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Submitting..." : "Record Attendance"}
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
  )
}

// Placeholder components for different sections
const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [reportType, setReportType] = useState("attendance");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Mock student data
  const students = [
    { id: "1", reg_number: "S12345", name: "John Doe", course: "CS101", email: "john.doe@example.com", attendance_rate: "85%" },
    { id: "2", reg_number: "S12346", name: "Jane Smith", course: "CS101", email: "jane.smith@example.com", attendance_rate: "92%" },
    { id: "3", reg_number: "S12347", name: "Alex Johnson", course: "CS102", email: "alex.j@example.com", attendance_rate: "78%" },
    { id: "4", reg_number: "S12348", name: "Maria Garcia", course: "CS102", email: "maria.g@example.com", attendance_rate: "95%" },
    { id: "5", reg_number: "S12349", name: "Raj Patel", course: "CS201", email: "raj.p@example.com", attendance_rate: "88%" },
    { id: "6", reg_number: "S12350", name: "Sarah Lee", course: "CS201", email: "sarah.l@example.com", attendance_rate: "90%" },
    { id: "7", reg_number: "S12351", name: "David Kim", course: "CS301", email: "david.k@example.com", attendance_rate: "82%" },
    { id: "8", reg_number: "S12352", name: "Michelle Wong", course: "CS301", email: "michelle.w@example.com", attendance_rate: "94%" },
  ];

  // Filter CS101 students for the mock report
  const cs101Students = students.filter(student => student.course === "CS101");

  // Mock course data
  const courses = [
    { id: "CS101", name: "Introduction to Computer Science" },
    { id: "CS102", name: "Programming Fundamentals" },
    { id: "CS201", name: "Data Structures and Algorithms" },
    { id: "CS301", name: "Database Systems" },
  ];
  
  // Mock attendance data for CS101 students
  const cs101AttendanceData = [
    { date: "2023-10-01", present: ["S12345", "S12346"], absent: [] },
    { date: "2023-10-03", present: ["S12345"], absent: ["S12346"] },
    { date: "2023-10-05", present: ["S12345", "S12346"], absent: [] },
    { date: "2023-10-08", present: ["S12346"], absent: ["S12345"] },
    { date: "2023-10-10", present: ["S12345", "S12346"], absent: [] },
  ];

  const handleDownloadCS101Report = () => {
    // Create mock HTML content for the PDF
    const htmlContent = `
      <html>
        <head>
          <title>CS101 Attendance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333366; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
            th { background-color: #f2f2f2; }
            .present { color: green; }
            .absent { color: red; }
            .header { margin-bottom: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CS101 - Introduction to Computer Science</h1>
            <h2>Attendance Report</h2>
            <p><strong>Period:</strong> October 1 - October 15, 2023</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <h3>Student Attendance Summary</h3>
          <table>
            <tr>
              <th>Registration Number</th>
              <th>Student Name</th>
              <th>Total Classes</th>
              <th>Classes Attended</th>
              <th>Attendance Rate</th>
            </tr>
            <tr>
              <td>S12345</td>
              <td>John Doe</td>
              <td>5</td>
              <td>4</td>
              <td>80%</td>
            </tr>
            <tr>
              <td>S12346</td>
              <td>Jane Smith</td>
              <td>5</td>
              <td>4</td>
              <td>80%</td>
            </tr>
          </table>
          
          <h3>Attendance Details by Date</h3>
          <table>
            <tr>
              <th>Date</th>
              <th>S12345 (John Doe)</th>
              <th>S12346 (Jane Smith)</th>
            </tr>
            <tr>
              <td>Oct 1, 2023</td>
              <td class="present">Present</td>
              <td class="present">Present</td>
            </tr>
            <tr>
              <td>Oct 3, 2023</td>
              <td class="present">Present</td>
              <td class="absent">Absent</td>
            </tr>
            <tr>
              <td>Oct 5, 2023</td>
              <td class="present">Present</td>
              <td class="present">Present</td>
            </tr>
            <tr>
              <td>Oct 8, 2023</td>
              <td class="absent">Absent</td>
              <td class="present">Present</td>
            </tr>
            <tr>
              <td>Oct 10, 2023</td>
              <td class="present">Present</td>
              <td class="present">Present</td>
            </tr>
          </table>
          
          <div class="footer">
            <p>This is an automatically generated report. For any discrepancies, please contact the faculty office.</p>
  </div>
        </body>
      </html>
    `;

    // Create a Blob from the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CS101_Attendance_Report.html';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const handleViewCS101Report = () => {
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  const filteredStudents = students.filter(student => {
    // Filter by search term
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.reg_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by course
    const matchesCourse = courseFilter === "all" || student.course === courseFilter;
    
    return matchesSearch && matchesCourse;
  });
  
  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };
  
  const generateReport = () => {
    setIsGeneratingReport(true);
    // Mock API call
    setTimeout(() => {
      setIsGeneratingReport(false);
      // Would normally redirect to or display the report
      alert("Report generated successfully");
    }, 1500);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Report Preview Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700">
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">CS101 - Attendance Report</h3>
              <Button 
                onClick={closeReportModal} 
                variant="ghost" 
                className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-gray-900 text-gray-100">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">CS101 - Introduction to Computer Science</h1>
                <h2 className="text-xl font-semibold text-gray-200 mt-1">Attendance Report</h2>
                <p className="text-gray-300 mt-2"><strong>Period:</strong> October 1 - October 15, 2023</p>
                <p className="text-gray-300"><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-white">Student Attendance Summary</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 border border-gray-700">
                    <thead>
                      <tr className="bg-gray-700 text-gray-100">
                        <th className="py-2 px-4 border border-gray-600 text-left">Registration Number</th>
                        <th className="py-2 px-4 border border-gray-600 text-left">Student Name</th>
                        <th className="py-2 px-4 border border-gray-600 text-left">Total Classes</th>
                        <th className="py-2 px-4 border border-gray-600 text-left">Classes Attended</th>
                        <th className="py-2 px-4 border border-gray-600 text-left">Attendance Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border border-gray-700">S12345</td>
                        <td className="py-2 px-4 border border-gray-700">John Doe</td>
                        <td className="py-2 px-4 border border-gray-700">5</td>
                        <td className="py-2 px-4 border border-gray-700">4</td>
                        <td className="py-2 px-4 border border-gray-700">80%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border border-gray-700">S12346</td>
                        <td className="py-2 px-4 border border-gray-700">Jane Smith</td>
                        <td className="py-2 px-4 border border-gray-700">5</td>
                        <td className="py-2 px-4 border border-gray-700">4</td>
                        <td className="py-2 px-4 border border-gray-700">80%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-white">Attendance Details by Date</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 border border-gray-700">
                    <thead>
                      <tr className="bg-gray-700 text-gray-100">
                        <th className="py-2 px-4 border border-gray-600 text-left">Date</th>
                        <th className="py-2 px-4 border border-gray-600 text-left">S12345 (John Doe)</th>
                        <th className="py-2 px-4 border border-gray-600 text-left">S12346 (Jane Smith)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border border-gray-700">Oct 1, 2023</td>
                        <td className="py-2 px-4 border border-gray-700 text-green-400 font-medium">Present</td>
                        <td className="py-2 px-4 border border-gray-700 text-green-400 font-medium">Present</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border border-gray-700">Oct 3, 2023</td>
                        <td className="py-2 px-4 border border-gray-700 text-green-400 font-medium">Present</td>
                        <td className="py-2 px-4 border border-gray-700 text-red-400 font-medium">Absent</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border border-gray-700">Oct 5, 2023</td>
                        <td className="py-2 px-4 border border-gray-700 text-green-400 font-medium">Present</td>
                        <td className="py-2 px-4 border border-gray-700 text-green-400 font-medium">Present</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border border-gray-700">Oct 8, 2023</td>
                        <td className="py-2 px-4 border border-gray-700 text-red-400 font-medium">Absent</td>
                        <td className="py-2 px-4 border border-gray-700 text-green-400 font-medium">Present</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border border-gray-700">Oct 10, 2023</td>
                        <td className="py-2 px-4 border border-gray-700 text-green-400 font-medium">Present</td>
                        <td className="py-2 px-4 border border-gray-700 text-green-400 font-medium">Present</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="text-sm text-gray-400 mt-8">
                <p>This is an automatically generated report. For any discrepancies, please contact the faculty office.</p>
              </div>
            </div>
            <div className="bg-gray-800 px-6 py-3 flex justify-end border-t border-gray-700">
              <Button onClick={handleDownloadCS101Report} className="bg-blue-600 hover:bg-blue-700 mr-2">
                Download Report
              </Button>
              <Button onClick={closeReportModal} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Student Management</h1>
        <p className="text-muted-foreground">Manage your students and track their progress</p>
      </div>
      <Tabs defaultValue="attendance" className="flex-1">
        <TabsList className="bg-gray-800 border-b border-gray-700">
          <TabsTrigger value="attendance" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="students" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            Student List
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="mt-6 flex-1">
          <ManualAttendance />
        </TabsContent>
        
        {/* Student List Tab */}
        <TabsContent value="students" className="mt-6">
          <Card className="bg-gray-900 text-white">
            <CardHeader className="bg-gray-900 pb-3 pt-5">
              <CardTitle>Student List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Search Students
                  </label>
                  <Input
                    type="text"
                    placeholder="Search by name or reg number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Filter by Course
                  </label>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-gray-800 border-gray-700 text-white"
                  >
                    <option value="all">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.id} - {course.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800">
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 font-medium">#</th>
                      <th className="text-left py-3 px-4 font-medium">Reg Number</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Course</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Attendance</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <tr key={student.id} className="border-b border-gray-800 hover:bg-gray-800">
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{student.reg_number}</td>
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4">{student.course}</td>
                          <td className="py-3 px-4">{student.email}</td>
                          <td className="py-3 px-4">{student.attendance_rate}</td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-gray-500">
                          No students match the filter criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Showing {filteredStudents.length} of {students.length} students
                </div>
                <div className="flex gap-2">
                  <Button className="bg-gray-800 hover:bg-gray-700" size="sm">
                    Previous
                  </Button>
                  <Button className="bg-gray-800 hover:bg-gray-700" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 text-white">
              <CardHeader className="bg-gray-900 pb-3 pt-5">
                <CardTitle>Generate Report</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); generateReport(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Report Type
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-gray-800 border-gray-700 text-white"
                    >
                      <option value="attendance">Attendance Report</option>
                      <option value="performance">Performance Report</option>
                      <option value="summary">Course Summary</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Select Course*
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-gray-800 border-gray-700 text-white"
                      required
                    >
                      <option value="">-- Select a Course --</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.id} - {course.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        From Date
                      </label>
                      <Input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        To Date
                      </label>
                      <Input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Report Format
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600 bg-gray-800 border-gray-700"
                          name="format"
                          value="pdf"
                          defaultChecked
                        />
                        <span className="ml-2 text-gray-300">PDF</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600 bg-gray-800 border-gray-700"
                          name="format"
                          value="excel"
                        />
                        <span className="ml-2 text-gray-300">Excel</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600 bg-gray-800 border-gray-700"
                          name="format"
                          value="csv"
                        />
                        <span className="ml-2 text-gray-300">CSV</span>
                      </label>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isGeneratingReport || !selectedCourse}
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                  >
                    {isGeneratingReport ? "Generating..." : "Generate Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 text-white">
              <CardHeader className="bg-gray-900 pb-3 pt-5">
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <div className="border-b border-gray-800 p-4 hover:bg-gray-800">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-white">CS101 Attendance Report</h3>
                      <span className="text-sm text-gray-400">Today</span>
                    </div>
                    <p className="text-sm text-gray-300">Attendance report for Introduction to Computer Science</p>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-blue-600 text-blue-400 hover:bg-blue-900/30 h-8 text-xs"
                        onClick={handleDownloadCS101Report}
                      >
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-gray-800 hover:bg-gray-700 h-8 text-xs"
                        onClick={handleViewCS101Report}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-800 p-4 hover:bg-gray-800">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-white">CS102 Performance Summary</h3>
                      <span className="text-sm text-gray-400">Yesterday</span>
                    </div>
                    <p className="text-sm text-gray-300">Performance statistics for Programming Fundamentals</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-900/30 h-8 text-xs">
                        Download
                      </Button>
                      <Button size="sm" className="bg-gray-800 hover:bg-gray-700 h-8 text-xs">
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-800 p-4 hover:bg-gray-800">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-white">CS201 Course Summary</h3>
                      <span className="text-sm text-gray-400">Last Week</span>
                    </div>
                    <p className="text-sm text-gray-300">Overall summary for Data Structures and Algorithms</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-900/30 h-8 text-xs">
                        Download
                      </Button>
                      <Button size="sm" className="bg-gray-800 hover:bg-gray-700 h-8 text-xs">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

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
)

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
)

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
)

const navItems = [
  { id: "scheduler", label: "Class Schedule", icon: Calendar },
  { id: "students", label: "Students", icon: Users },
  { id: "assignments", label: "Assignments", icon: Library },
  { id: "grades", label: "Grades", icon: GraduationCap },
  { id: "courses", label: "Course Content", icon: Book },
  { id: "resources", label: "Resource Management", icon: Library },
]

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [activeSection, setActiveSection] = useState("scheduler")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8100/user", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Authentication failed")
        }

        const userData = await response.json()
        console.log("User data fetched:", userData)

        if (userData.role !== "Faculty") {
          console.log("Invalid role, redirecting to home")
          navigate("/")
          return
        }

        setUser(userData)
      } catch (error) {
        console.error("Error fetching user data:", error)
        navigate("/")
      }
    }

    fetchUser()

    // Add event listener to handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [navigate])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8100/logout", {
        method: "GET",
        credentials: "include",
      })

      // Regardless of response, redirect to login page
      navigate("/")
    } catch (error) {
      console.error("Error during logout:", error)
      // Even if there's an error, still redirect to login page
      navigate("/")
    }
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "scheduler":
        return <Scheduler />
      case "students":
        return <Students />
      case "assignments":
        return <Assignments />
      case "grades":
        return <Grades />
      case "courses":
        return <CourseContent />
      case "resources":
        return <ResourceManagement />
      default:
        return <Scheduler />
    }
  }

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
        <div
          className={`${isSidebarOpen ? "block" : "hidden"} md:block bg-gray-900 text-white border-r flex-shrink-0 ${
            isSidebarOpen ? "w-full md:w-64" : "w-0"
          } transition-all duration-300 fixed md:static md:h-full z-20 h-[calc(100%-4rem)]`}
        >
          <div className="hidden md:block p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold">Faculty Portal</h2>
          </div>
          <nav className="mt-4 overflow-y-auto h-[calc(100%-8rem)]">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
          <button
                    onClick={() => {
                      setActiveSection(item.id)
                      if (window.innerWidth < 768) {
                        setIsSidebarOpen(false)
                      }
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left ${
                      activeSection === item.id
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
        <div className="flex-1 overflow-auto w-full h-full p-2 md:p-4">{renderActiveSection()}</div>
      </div>
    </div>
  )
}

export default FacultyDashboard
