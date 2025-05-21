import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, Clock, FileText, MapPin, User, BookOpen, GraduationCap, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import axios from 'axios';
import API_CONFIG from '../lib/config';

interface Course {
  id: string;
  name: string;
  hasContent?: boolean;
}

interface Exam {
  id: string;
  name: string;
  user_id: string;
  course_id: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  total_marks: number;
  passing_marks: number;
}

interface Assignment {
  id: string;
  name: string;
  user_id: string;
  course_id: string;
  description: string;
  due_date_and_time: string;
  attachment_url: string;
  notified: boolean;
}

interface CourseWithContent extends Course {
  assignments: Assignment[];
  exams: Exam[];
}

const Scheduler = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesWithContent, setCoursesWithContent] = useState<CourseWithContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Fetch all courses
        const coursesResponse = await axios.get<Course[]>('http://localhost:8020/courses');
        const allCourses = coursesResponse.data;
        setCourses(allCourses);
        
        // 2. For each course, fetch assignments and exams
        const coursesWithContentPromises = allCourses.map(async (course) => {
          try {
            // Fetch assignments for this course
            const assignmentsResponse = await axios.get<Assignment[]>(
              `http://localhost:8020/api/assignments/${course.id}`
            );
            const assignments = Array.isArray(assignmentsResponse.data) ? assignmentsResponse.data : [];
            
            // Fetch exams for this course
            const examsResponse = await axios.get<Exam[]>(
              `http://localhost:8020/api/exams/${course.id}`
            );
            const exams = Array.isArray(examsResponse.data) ? examsResponse.data : [];
            
            // Return course with its assignments and exams
            return {
              ...course,
              assignments,
              exams,
              hasContent: assignments.length > 0 || exams.length > 0
            };
          } catch (error) {
            console.error(`Error fetching data for course ${course.name}:`, error);
            // Return course with empty assignments and exams
            return {
              ...course,
              assignments: [],
              exams: [],
              hasContent: false
            };
          }
        });
        
        // Wait for all promises to resolve
        const completedCoursesWithContent = await Promise.all(coursesWithContentPromises);
        
        // Filter only courses that have at least one assignment or exam
        const filteredCoursesWithContent = completedCoursesWithContent.filter(
          course => course.assignments.length > 0 || course.exams.length > 0
        );
        
        setCoursesWithContent(filteredCoursesWithContent);

        // Set first course as active tab if there are courses with content
        if (filteredCoursesWithContent.length > 0) {
          setActiveTab(filteredCoursesWithContent[0].id);
        }

      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data. Please try again later.');
        
        // Set up mock data for testing
        const mockCoursesWithContent: CourseWithContent[] = [
          {
            id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
            name: 'Mathematics',
            assignments: [
              {
                id: 'c3d4e5f6-a7b8-4c2d-9e1f-2a3b5c7d8e9f',
                name: 'Linear Algebra Problem Set',
                user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
                course_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
                description: 'Solve the matrix operations and vector space problems',
                due_date_and_time: '2023-11-18T23:59:00+00:00',
                attachment_url: 'https://example.com/assignments/math/linear-algebra-ps3.pdf',
                notified: true
              }
            ],
            exams: [
              {
                id: 'a3b4c5d6-e7f8-4a9b-8c1d-2e3f4a5b6c7d',
                name: 'Linear Algebra Quiz 2',
                user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
                course_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
                description: 'Matrix operations and vector spaces',
                date: '2023-11-10',
                start_time: '10:15:00',
                end_time: '11:45:00',
                total_marks: 50,
                passing_marks: 25
              },
              {
                id: 'a3b4c5d6-e7f8-4a9b-8c1d-2e3f4a5b6c7e',
                name: 'Linear Algebra Quiz 3',
                user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
                course_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
                description: 'Matrix operations and vector spaces',
                date: '2023-12-10',
                start_time: '10:15:00',
                end_time: '11:45:00',
                total_marks: 50,
                passing_marks: 25
              }
            ],
            hasContent: true
          },
          {
            id: '44444444-4444-4444-4444-444444444444',
            name: 'Database Systems',
            assignments: [
              {
                id: 'd5e6f7g8-h9i0-5j6k-7l8m-9n0o1p2q3r4s',
                name: 'ER Diagram Design',
                user_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
                course_id: '44444444-4444-4444-4444-444444444444',
                description: 'Create an entity-relationship diagram for the given scenario',
                due_date_and_time: '2023-11-25T23:59:00+00:00',
                attachment_url: 'https://example.com/assignments/db/er-diagram.pdf',
                notified: true
              }
            ],
            exams: [],
            hasContent: true
          }
        ];
        
        setCoursesWithContent(mockCoursesWithContent);
        if (mockCoursesWithContent.length > 0) {
          setActiveTab(mockCoursesWithContent[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    // Convert "10:15:00" to "10:15 AM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Find exams coming up in the next 7 days
  const getUpcomingExams = () => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return coursesWithContent.flatMap(course => 
      course.exams.filter(exam => {
        const examDate = new Date(exam.date);
        return examDate >= now && examDate <= nextWeek;
      }).map(exam => ({
        ...exam,
        courseName: course.name
      }))
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Find assignments due in the next 7 days
  const getUpcomingAssignments = () => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return coursesWithContent.flatMap(course => 
      course.assignments.filter(assignment => {
        const dueDate = new Date(assignment.due_date_and_time);
        return dueDate >= now && dueDate <= nextWeek;
      }).map(assignment => ({
        ...assignment,
        courseName: course.name
      }))
    ).sort((a, b) => new Date(a.due_date_and_time).getTime() - new Date(b.due_date_and_time).getTime());
  };

  const upcomingExams = getUpcomingExams();
  const upcomingAssignments = getUpcomingAssignments();

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Academic Schedule</h1>
        <p className="text-gray-200">View assignments and exams for your courses</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-500/50 text-red-300 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      ) : coursesWithContent.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-md p-6 text-center">
          <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">No Course Content Available</h3>
          <p className="text-gray-400">There are no assignments or exams scheduled for any of your courses.</p>
        </div>
      ) : (
        <>
          {/* Upcoming Items Summary */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white font-bold">Upcoming Schedule</CardTitle>
              <CardDescription className="text-gray-400">Items due in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-blue-400" />
                    Upcoming Assignments
                  </h3>
                  {upcomingAssignments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No assignments due in the next 7 days</p>
                  ) : (
                    <div className="space-y-2">
                      {upcomingAssignments.map(assignment => (
                        <div key={assignment.id} className="bg-gray-850 rounded-md p-3 border border-gray-700">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-white">{assignment.name}</h4>
                            <Badge className="bg-blue-900/40 text-blue-300">{assignment.courseName}</Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Due: {formatDate(assignment.due_date_and_time)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1 text-red-400" />
                    Upcoming Exams
                  </h3>
                  {upcomingExams.length === 0 ? (
                    <p className="text-gray-500 text-sm">No exams scheduled in the next 7 days</p>
                  ) : (
                    <div className="space-y-2">
                      {upcomingExams.map(exam => (
                        <div key={exam.id} className="bg-gray-850 rounded-md p-3 border border-gray-700">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-white">{exam.name}</h4>
                            <Badge className="bg-red-900/40 text-red-300">{exam.courseName}</Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Date: {formatDate(exam.date)}</span>
                            <Clock className="h-3 w-3 ml-3 mr-1" />
                            <span>{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="bg-gray-800 border-b border-gray-700 overflow-x-auto flex whitespace-nowrap px-1">
              {/* All Courses Tab */}
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                All Courses
              </TabsTrigger>
              
              {coursesWithContent.map(course => (
                <TabsTrigger 
                  key={course.id} 
                  value={course.id}
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                >
                  {course.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All Courses Content */}
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                {coursesWithContent.map(course => (
                  <Card key={course.id} className="bg-gray-800 text-white border-gray-700">
                    <CardHeader className="bg-gray-800 pb-3 pt-5">
                      <CardTitle>{course.name}</CardTitle>
                      <CardDescription>
                        {course.assignments.length} assignments • {course.exams.length} exams
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Assignments */}
                        <div>
                          <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-400" />
                            Assignments
                          </h3>
                          {course.assignments.length === 0 ? (
                            <p className="text-gray-500">No assignments for this course</p>
                          ) : (
                            <div className="space-y-3">
                              {course.assignments.map(assignment => (
                                <div key={assignment.id} className="bg-gray-850 rounded-md p-4 border border-gray-700">
                                  <h4 className="font-medium text-white mb-2">{assignment.name}</h4>
                                  <div className="flex items-center text-sm text-gray-400 mb-2">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    <span>Due: {formatDate(assignment.due_date_and_time)}</span>
                                  </div>
                                  <p className="text-sm text-gray-300">{assignment.description}</p>
                                  {assignment.attachment_url && (
                                    <a 
                                      href={assignment.attachment_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-400 hover:underline mt-2 inline-block"
                                    >
                                      View Attachment
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Exams */}
                        <div>
                          <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                            <GraduationCap className="h-5 w-5 mr-2 text-red-400" />
                            Exams
                          </h3>
                          {course.exams.length === 0 ? (
                            <p className="text-gray-500">No exams for this course</p>
                          ) : (
                            <div className="space-y-3">
                              {course.exams.map(exam => (
                                <div key={exam.id} className="bg-gray-850 rounded-md p-4 border border-gray-700">
                                  <h4 className="font-medium text-white mb-2">{exam.name}</h4>
                                  <div className="flex items-center text-sm text-gray-400 mb-2">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    <span>{formatDate(exam.date)}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-400 mb-2">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    <span>{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</span>
                                  </div>
                                  <p className="text-sm text-gray-300">{exam.description}</p>
                                  <div className="mt-2 flex items-center text-sm">
                                    <span className="text-gray-400">Total Marks: </span>
                                    <span className="ml-1 text-white">{exam.total_marks}</span>
                                    <span className="mx-2 text-gray-500">•</span>
                                    <span className="text-gray-400">Passing Marks: </span>
                                    <span className="ml-1 text-white">{exam.passing_marks}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Individual Course Content */}
            {coursesWithContent.map(course => (
              <TabsContent key={course.id} value={course.id} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assignments */}
                  <Card className="bg-gray-800 text-white border-gray-700">
                    <CardHeader className="bg-gray-800 pb-3 pt-5">
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-400" />
                        Assignments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {course.assignments.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No assignments for {course.name}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {course.assignments.map((assignment) => (
                            <div key={assignment.id} className="border-b border-gray-700 p-4 hover:bg-gray-700">
                              <div className="mb-1">
                                <h3 className="font-medium text-white">{assignment.name}</h3>
                              </div>
                              <div className="flex items-center text-sm text-gray-400 mb-2">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>Due: {formatDate(assignment.due_date_and_time)}</span>
                              </div>
                              <p className="text-sm text-gray-300">{assignment.description}</p>
                              {assignment.attachment_url && (
                                <a 
                                  href={assignment.attachment_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-400 hover:underline mt-2 inline-block"
                                >
                                  View Attachment
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Exams */}
                  <Card className="bg-gray-800 text-white border-gray-700">
                    <CardHeader className="bg-gray-800 pb-3 pt-5">
                      <CardTitle className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-red-400" />
                        Exams
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {course.exams.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No exams for {course.name}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {course.exams.map((exam) => (
                            <div key={exam.id} className="border-b border-gray-700 p-4 hover:bg-gray-700">
                              <div className="mb-1">
                                <h3 className="font-medium text-white">{exam.name}</h3>
                              </div>
                              <div className="flex items-center text-sm text-gray-400 mb-2">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{formatDate(exam.date)}</span>
                                <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                                <span>{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</span>
                              </div>
                              <p className="text-sm text-gray-300">{exam.description}</p>
                              <div className="mt-2 flex items-center text-sm">
                                <span className="text-gray-400">Total Marks: </span>
                                <span className="ml-1 text-white">{exam.total_marks}</span>
                                <span className="mx-2 text-gray-500">•</span>
                                <span className="text-gray-400">Passing Marks: </span>
                                <span className="ml-1 text-white">{exam.passing_marks}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Scheduler;
