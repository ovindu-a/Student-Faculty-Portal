import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Users,
  FileText,
  Search,
  PlusCircle,
  XCircle,
  BarChart3,
  RefreshCcw,
  Loader2,
  AlertCircle,
  BookOpen,
  CheckCircle,
  User,
  Mail
} from "lucide-react";

interface Student {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
}

interface StudentCourseData {
  avg_score: number;
  total_time_spent: number;
  courses_completed: number;
}

interface StudentWithData {
  student_info: Student;
  enrollment_id: string;
  data: StudentCourseData;
}

interface Course {
  id: string;
  name: string;
}

interface CourseData {
  students_data: StudentWithData[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FacultyCourseManagementProps {
  user: User;
}

const FacultyCourseManagement: React.FC<FacultyCourseManagementProps> = ({ user }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseData, setSelectedCourseData] = useState<CourseData | null>(null);
  const [unregisteredStudents, setUnregisteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingCourseData, setIsLoadingCourseData] = useState(false);
  const [isLoadingUnregistered, setIsLoadingUnregistered] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  const [actionStudentId, setActionStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('enrolled');

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      setError(null);

      try {
        const response = await axios.get<Course[]>(`http://localhost:8020/faculty/${user.id}/courses`);
        const allCourses = response.data;
        
        // Fetch student data for each course to determine if it has enrolled students
        const coursesWithStudentData = await Promise.all(
          allCourses.map(async (course) => {
            try {
              const dataResponse = await axios.get<CourseData>(
                `http://localhost:8020/courses/${course.id}/data`
              );
              return {
                course,
                hasStudents: dataResponse.data?.students_data?.length > 0
              };
            } catch (error) {
              console.error(`Error fetching data for course ${course.name}:`, error);
              return {
                course,
                hasStudents: false
              };
            }
          })
        );
        
        // Filter out courses with no students
        const coursesWithStudents = coursesWithStudentData
          .filter(item => item.hasStudents)
          .map(item => item.course);
        
        setCourses(coursesWithStudents);
        
        // Select the first course by default if available
        if (coursesWithStudents.length > 0) {
          setSelectedCourse(coursesWithStudents[0]);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [user.id]); // Only re-run if user ID changes

  // Fetch course data when selected course changes
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchCourseData = async () => {
      setIsLoadingCourseData(true);
      setError(null);

      try {
        const response = await axios.get<CourseData>(`http://localhost:8020/courses/${selectedCourse.id}/data`);
        setSelectedCourseData(response.data);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data. Please try again later.');
        setSelectedCourseData(null);
      } finally {
        setIsLoadingCourseData(false);
      }
    };

    fetchCourseData();
  }, [selectedCourse]);

  // Fetch unregistered students when tab changes to enrollment
  useEffect(() => {
    if (activeTab !== 'enrollment' || !selectedCourse) return;
    
    fetchUnregisteredStudents();
  }, [activeTab, selectedCourse]);

  const fetchUnregisteredStudents = async () => {
    if (!selectedCourse) return;

    setIsLoadingUnregistered(true);
    setError(null);

    try {
      const response = await axios.get<Student[]>(`http://localhost:8020/courses/${selectedCourse.id}/unregistered-students`);
      setUnregisteredStudents(response.data);
    } catch (err) {
      console.error('Error fetching unregistered students:', err);
      setError('Failed to load unregistered students. Please try again later.');
      setUnregisteredStudents([]);
    } finally {
      setIsLoadingUnregistered(false);
    }
  };

  const handleEnrollStudent = async (studentId: string) => {
    if (!selectedCourse) return;

    setIsEnrolling(true);
    setActionStudentId(studentId);
    setError(null);

    try {
      await axios.post(`http://localhost:8020/courses/${selectedCourse.id}/enroll/${studentId}`);
      
      // Remove the student from unregistered list
      setUnregisteredStudents(prev => prev.filter(s => s.id !== studentId));
      
      // Refresh course data to include the new student
      const response = await axios.get<CourseData>(`http://localhost:8020/courses/${selectedCourse.id}/data`);
      setSelectedCourseData(response.data);
    } catch (err) {
      console.error('Error enrolling student:', err);
      setError('Failed to enroll student. Please try again.');
    } finally {
      setIsEnrolling(false);
      setActionStudentId(null);
    }
  };

  const handleUnenrollStudent = async (studentId: string) => {
    if (!selectedCourse) return;

    setIsUnenrolling(true);
    setActionStudentId(studentId);
    setError(null);

    try {
      await axios.delete(`http://localhost:8020/courses/${selectedCourse.id}/unenroll/${studentId}`);
      
      // Refresh course data to reflect the change
      const response = await axios.get<CourseData>(`http://localhost:8020/courses/${selectedCourse.id}/data`);
      setSelectedCourseData(response.data);
      
      // If this was the last student in the course, remove the course from the list
      if (response.data.students_data.length === 0) {
        setCourses(prevCourses => prevCourses.filter(course => course.id !== selectedCourse.id));
        
        // Reset selected course if there are other courses available
        const remainingCourses = courses.filter(course => course.id !== selectedCourse.id);
        if (remainingCourses.length > 0) {
          setSelectedCourse(remainingCourses[0]);
        } else {
          setSelectedCourse(null);
        }
      }
      
      // Refresh unregistered students if on enrollment tab
      if (activeTab === 'enrollment') {
        await fetchUnregisteredStudents();
      }
    } catch (err) {
      console.error('Error unenrolling student:', err);
      setError('Failed to unenroll student. Please try again.');
    } finally {
      setIsUnenrolling(false);
      setActionStudentId(null);
    }
  };

  // Calculate course analytics
  const calculateAnalytics = () => {
    if (!selectedCourseData?.students_data.length) return null;

    const students = selectedCourseData.students_data;
    
    const totalStudents = students.length;
    const totalAvgScore = students.reduce((sum, s) => sum + s.data.avg_score, 0);
    const averageScore = totalAvgScore / totalStudents;
    
    const highPerformers = students.filter(s => s.data.avg_score >= 75).length;
    const averagePerformers = students.filter(s => s.data.avg_score >= 60 && s.data.avg_score < 75).length;
    const lowPerformers = students.filter(s => s.data.avg_score < 60).length;
    
    // Percentages
    const highPerformersPercent = Math.round((highPerformers / totalStudents) * 100);
    const averagePerformersPercent = Math.round((averagePerformers / totalStudents) * 100);
    const lowPerformersPercent = Math.round((lowPerformers / totalStudents) * 100);
    
    // Average time spent across all students
    const totalTimeSpent = students.reduce((sum, s) => sum + s.data.total_time_spent, 0);
    const averageTimeSpent = totalTimeSpent / totalStudents;
    
    // Sort students by performance
    const topStudents = [...students]
      .sort((a, b) => b.data.avg_score - a.data.avg_score)
      .slice(0, 3);
    
    return {
      totalStudents,
      averageScore,
      highPerformers,
      averagePerformers,
      lowPerformers,
      highPerformersPercent,
      averagePerformersPercent,
      lowPerformersPercent,
      averageTimeSpent,
      topStudents
    };
  };

  const analytics = calculateAnalytics();

  // Filter students based on search term
  const filteredStudents = (students: StudentWithData[] = []) => {
    if (!searchTerm) return students;
    
    return students.filter(
      s => 
        s.student_info.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.student_info.last_name && s.student_info.last_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (s.student_info.email && s.student_info.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  const filteredUnregisteredStudents = () => {
    if (!searchTerm) return unregisteredStudents;
    
    return unregisteredStudents.filter(
      s => 
        s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.last_name && s.last_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Helper function to get grade letter
  const getGradeLetter = (score: number): string => {
    if (score >= 75) return "A";
    if (score >= 65) return "B";
    if (score >= 55) return "C";
    if (score >= 45) return "D";
    return "F";
  };

  // Helper function to get grade color
  const getGradeColor = (score: number): string => {
    if (score >= 75) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (score >= 65) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (score >= 55) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    if (score >= 45) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };
  
  // Helper function to format student name
  const formatStudentName = (student: Student): string => {
    return `${student.first_name}${student.last_name ? ' ' + student.last_name : ''}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Course Management</h1>
        <p className="text-gray-400">Manage courses, students, and view performance analytics</p>
      </div>

      {isLoadingCourses ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error && !selectedCourse ? (
        <div className="bg-red-900/20 border border-red-500/50 text-red-300 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-md p-6 text-center">
          <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">No Courses Available</h3>
          <p className="text-gray-400">There are no courses available to manage.</p>
        </div>
      ) : (
        <>
          {/* Course Selection */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="text-sm text-gray-400">Select Course:</div>
            <div className="flex flex-wrap gap-2">
              {courses.map(course => (
                <Badge
                  key={course.id}
                  variant={selectedCourse?.id === course.id ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 ${
                    selectedCourse?.id === course.id 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                  }`}
                  onClick={() => setSelectedCourse(course)}
                >
                  {course.name}
                </Badge>
              ))}
            </div>
          </div>

          {selectedCourse && (
            <>
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl text-white">{selectedCourse.name}</CardTitle>
                      <CardDescription>
                        {isLoadingCourseData 
                          ? 'Loading course details...' 
                          : `${selectedCourseData?.students_data.length || 0} enrolled students`}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsLoadingCourseData(true);
                        axios.get<CourseData>(`http://localhost:8020/courses/${selectedCourse.id}/data`)
                          .then(res => setSelectedCourseData(res.data))
                          .catch(err => console.error('Error refreshing course data:', err))
                          .finally(() => setIsLoadingCourseData(false));
                      }}
                      disabled={isLoadingCourseData}
                      className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                    >
                      {isLoadingCourseData 
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <RefreshCcw className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <TabsList className="bg-gray-800 border-b border-gray-700">
                  <TabsTrigger value="enrolled" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Enrolled Students
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="enrollment" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Enrollment
                  </TabsTrigger>
                </TabsList>

                {/* Enrolled Students Tab */}
                <TabsContent value="enrolled" className="mt-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle>Enrolled Students</CardTitle>
                        <div className="relative w-64">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Search students..."
                            className="pl-8 bg-gray-700 border-gray-600 text-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {isLoadingCourseData ? (
                        <div className="flex justify-center items-center h-64">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                      ) : selectedCourseData?.students_data.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          No students enrolled in this course
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-gray-800 border-gray-700">
                                <TableHead className="text-gray-400">Student</TableHead>
                                <TableHead className="text-gray-400">Email</TableHead>
                                <TableHead className="text-gray-400">Average Score</TableHead>
                                <TableHead className="text-gray-400">Time Spent (hours)</TableHead>
                                <TableHead className="text-gray-400">Courses Completed</TableHead>
                                <TableHead className="text-gray-400">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredStudents(selectedCourseData?.students_data || []).map((student) => (
                                <TableRow key={student.enrollment_id} className="hover:bg-gray-700 border-gray-700">
                                  <TableCell className="font-medium text-white">
                                    {formatStudentName(student.student_info)}
                                  </TableCell>
                                  <TableCell className="text-gray-300">
                                    {student.student_info.email || 'N/A'}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={`${getGradeColor(student.data.avg_score)}`}>
                                      {student.data.avg_score !== undefined ? student.data.avg_score.toFixed(1) : '0.0'} ({getGradeLetter(student.data.avg_score || 0)})
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-gray-300">
                                    {student.data.total_time_spent}
                                  </TableCell>
                                  <TableCell className="text-gray-300">
                                    {student.data.courses_completed}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleUnenrollStudent(student.student_info.id)}
                                      disabled={isUnenrolling && actionStudentId === student.student_info.id}
                                      className="bg-red-900/30 hover:bg-red-900/60 text-red-300 border-red-900/50"
                                    >
                                      {isUnenrolling && actionStudentId === student.student_info.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <>
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Unenroll
                                        </>
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white">Performance Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoadingCourseData ? (
                          <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          </div>
                        ) : !selectedCourseData?.students_data.length ? (
                          <div className="text-center text-gray-500">
                            No student data available
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="text-sm text-gray-400">Average Score</div>
                              <div className="text-2xl font-bold text-white">{analytics?.averageScore ? analytics.averageScore.toFixed(2) : '0.00'}%</div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <div>High Performers ({analytics?.highPerformers})</div>
                                <div>{analytics?.highPerformersPercent}%</div>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${analytics?.highPerformersPercent}%` }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <div>Average Performers ({analytics?.averagePerformers})</div>
                                <div>{analytics?.averagePerformersPercent}%</div>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${analytics?.averagePerformersPercent}%` }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <div>Low Performers ({analytics?.lowPerformers})</div>
                                <div>{analytics?.lowPerformersPercent}%</div>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${analytics?.lowPerformersPercent}%` }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white">Engagement Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoadingCourseData ? (
                          <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          </div>
                        ) : !selectedCourseData?.students_data.length ? (
                          <div className="text-center text-gray-500">
                            No student data available
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Total Students</div>
                              <div className="text-2xl font-bold text-white">{analytics?.totalStudents}</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Average Time Spent</div>
                              <div className="text-2xl font-bold text-white">{analytics?.averageTimeSpent ? analytics.averageTimeSpent.toFixed(1) : '0.0'} hours</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Student Distribution</div>
                              <div className="flex mt-2 gap-1 h-8">
                                <div 
                                  className="bg-green-500 rounded-l-sm" 
                                  style={{ width: `${analytics?.highPerformersPercent}%` }}
                                  title={`High Performers: ${analytics?.highPerformersPercent}%`}
                                ></div>
                                <div 
                                  className="bg-blue-500" 
                                  style={{ width: `${analytics?.averagePerformersPercent}%` }}
                                  title={`Average Performers: ${analytics?.averagePerformersPercent}%`}
                                ></div>
                                <div 
                                  className="bg-red-500 rounded-r-sm" 
                                  style={{ width: `${analytics?.lowPerformersPercent}%` }}
                                  title={`Low Performers: ${analytics?.lowPerformersPercent}%`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white">Top Performing Students</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoadingCourseData ? (
                          <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          </div>
                        ) : !selectedCourseData?.students_data.length ? (
                          <div className="text-center text-gray-500">
                            No student data available
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {analytics?.topStudents?.map((student, idx) => (
                              <div key={student.student_info.id} className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                  <span className="text-gray-300">#{idx + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-white">{formatStudentName(student.student_info)}</div>
                                  <div className="text-xs text-gray-400">{student.student_info.email || 'No email'}</div>
                                </div>
                                <Badge className={`${getGradeColor(student.data.avg_score)}`}>
                                  {student.data.avg_score ? student.data.avg_score.toFixed(1) : '0.0'}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Enrollment Management Tab */}
                <TabsContent value="enrollment" className="mt-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Available Students</CardTitle>
                        <div className="flex gap-3">
                          <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              placeholder="Search students..."
                              className="pl-8 bg-gray-700 border-gray-600 text-gray-200"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={fetchUnregisteredStudents}
                            disabled={isLoadingUnregistered}
                            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                          >
                            {isLoadingUnregistered 
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <RefreshCcw className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {isLoadingUnregistered ? (
                        <div className="flex justify-center items-center h-64">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                      ) : error && activeTab === 'enrollment' ? (
                        <div className="p-4 text-center">
                          <div className="inline-flex bg-red-900/20 border border-red-500/50 text-red-300 rounded-md px-4 py-2">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                          </div>
                        </div>
                      ) : unregisteredStudents.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          No available students to enroll
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-gray-800 border-gray-700">
                                <TableHead className="text-gray-400">Student</TableHead>
                                <TableHead className="text-gray-400">Email</TableHead>
                                <TableHead className="text-gray-400">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredUnregisteredStudents().map((student) => (
                                <TableRow key={student.id} className="hover:bg-gray-700 border-gray-700">
                                  <TableCell className="font-medium text-white">
                                    <div className="flex items-center">
                                      <User className="h-4 w-4 mr-2 text-gray-400" />
                                      {formatStudentName(student)}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-gray-300">
                                    <div className="flex items-center">
                                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                      {student.email || 'No email provided'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleEnrollStudent(student.id)}
                                      disabled={isEnrolling && actionStudentId === student.id}
                                      className="bg-green-900/30 hover:bg-green-900/60 text-green-300 border-green-900/50"
                                    >
                                      {isEnrolling && actionStudentId === student.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <>
                                          <PlusCircle className="h-4 w-4 mr-1" />
                                          Enroll
                                        </>
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FacultyCourseManagement; 