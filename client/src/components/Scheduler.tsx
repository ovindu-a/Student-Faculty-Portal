import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Calendar, 
  Clock, 
  FileText, 
  MapPin, 
  User, 
  Loader2,
  CalendarDays,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import axios from 'axios';
import API_CONFIG from '../lib/config';

interface ExamForm {
  title: string;
  start_time: string;
  end_time: string;
  course_code: string;
  exam_date: string;
  notified: boolean;
  description: string;
  location: string;
  scheduled_by: string;
}

interface ExamResponse {
  exam_id: string;
  title: string;
  course_code: string;
  scheduled_by: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  location: string;
  notified: boolean;
  description?: string;
}

interface AssignmentForm {
  title: string;
  due_time: string;
  course_code: string;
  due_date: string;
  notified: boolean;
  description: string;
  assigned_by: string;
  attachment_url: string;
}

interface AssignmentResponse {
  assignment_id: string;
  title: string;
  course_code: string;
  assigned_by: string;
  created_at: string;
  description: string;
  due_date_and_time: string;
  attachment_url: string;
  notified: boolean;
}

interface ScheduledItem {
  id: string | number;
  title: string;
  course_code: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
}

interface Course {
  id: string;
  name: string;
}

const Scheduler = () => {
  // Form states
  const [examForm, setExamForm] = useState<ExamForm>({
    title: '',
    start_time: '',
    end_time: '',
    course_code: '',
    exam_date: '',
    notified: false,
    description: '',
    location: '',
    scheduled_by: ''
  });

  const [assignmentForm, setAssignmentForm] = useState<AssignmentForm>({
    title: '',
    due_time: '',
    course_code: '',
    due_date: '',
    notified: false,
    description: '',
    assigned_by: '',
    attachment_url: ''
  });

  // Scheduled items state
  const [scheduledAssignments, setScheduledAssignments] = useState<ScheduledItem[]>([]);
  const [scheduledExams, setScheduledExams] = useState<ScheduledItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add new states for courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user ID first
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(API_CONFIG.AUTH.USER, {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUserId(userData.id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setError('Failed to authenticate user.');
      }
    };

    fetchUserId();
  }, []);

  // Fetch faculty courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) return;
      
      setIsLoadingCourses(true);
      try {
        const response = await axios.get<Course[]>(`https://student.campus-management.ovindu.com/faculty/${userId}/courses`);
        setCourses(response.data);
        
        // Set first course as selected by default
        if (response.data.length > 0) {
          setSelectedCourse(response.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses.');
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [userId]);

  // Load assignments and exams for selected course
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCourse) return;
      
      setIsLoadingData(true);
      setError(null);
      
      try {
        // Fetch assignments for the selected course
        const assignmentsResponse = await axios.get<AssignmentResponse[]>(
          `https://student.campus-management.ovindu.com/api/assignments/${selectedCourse}`
        );
        
        // Convert API response to ScheduledItem format
        const formattedAssignments: ScheduledItem[] = assignmentsResponse.data.map(assignment => {
          const dueDateTime = new Date(assignment.due_date_and_time);
          return {
            id: assignment.assignment_id,
            title: assignment.title,
            course_code: assignment.course_code,
            date: dueDateTime.toISOString().split('T')[0],
            time: dueDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: assignment.description
          };
        });
        
        setScheduledAssignments(formattedAssignments);
        
        // Fetch exams for the selected course
        const examsResponse = await axios.get<ExamResponse[]>(
          `https://student.campus-management.ovindu.com/api/exams/${selectedCourse}`
        );
        
        // Convert API response to ScheduledItem format
        const formattedExams: ScheduledItem[] = examsResponse.data.map(exam => {
          return {
            id: exam.exam_id,
            title: exam.title,
            course_code: exam.course_code,
            date: exam.exam_date,
            time: `${exam.start_time.substring(0, 5)} - ${exam.end_time.substring(0, 5)}`,
            location: exam.location,
            description: exam.description
          };
        });
        
        setScheduledExams(formattedExams);
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        setError('Failed to load schedule data. Please try again later.');
        setScheduledAssignments([]);
        setScheduledExams([]);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, [selectedCourse]);

  const handleExamChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setExamForm({
      ...examForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAssignmentChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setAssignmentForm({
      ...assignmentForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const submitExamForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(API_CONFIG.SCHEDULE.EXAMS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: examForm.title,
          course_code: examForm.course_code,
          exam_date: examForm.exam_date,
          start_time: examForm.start_time,
          end_time: examForm.end_time,
          location: examForm.location,
          description: examForm.description,
          notified: examForm.notified,
          scheduled_by: examForm.scheduled_by || "Faculty User"
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Add to scheduled exams
        const newExam: ScheduledItem = {
          id: data.exam_id,
          title: examForm.title,
          course_code: examForm.course_code,
          date: examForm.exam_date,
          time: `${examForm.start_time} - ${examForm.end_time}`,
          location: examForm.location,
          description: examForm.description
        };
        
        setScheduledExams([...scheduledExams, newExam]);
        
        // Reset form
        setExamForm({
          title: '',
          start_time: '',
          end_time: '',
          course_code: '',
          exam_date: '',
          notified: false,
          description: '',
          location: '',
          scheduled_by: ''
        });
      } else {
        console.error('Failed to schedule exam');
      }
    } catch (error) {
      console.error('Error scheduling exam:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAssignmentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Calculate due date and time in ISO format
      const dueDateTimeISO = `${assignmentForm.due_date}T${assignmentForm.due_time}:00`;
      
      // Make API call
      const response = await fetch(API_CONFIG.SCHEDULE.ASSIGNMENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: assignmentForm.title,
          course_code: assignmentForm.course_code,
          due_date_and_time: dueDateTimeISO,
          description: assignmentForm.description,
          notified: assignmentForm.notified,
          assigned_by: assignmentForm.assigned_by || "Faculty User",
          attachment_url: assignmentForm.attachment_url || ""
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Add to scheduled assignments
        const newAssignment: ScheduledItem = {
          id: data.assignment_id,
          title: assignmentForm.title,
          course_code: assignmentForm.course_code,
          date: assignmentForm.due_date,
          time: assignmentForm.due_time,
          description: assignmentForm.description
        };
        
        setScheduledAssignments([...scheduledAssignments, newAssignment]);
        
        // Reset form
        setAssignmentForm({
          title: '',
          due_time: '',
          course_code: '',
          due_date: '',
          notified: false,
          description: '',
          assigned_by: '',
          attachment_url: ''
        });
      } else {
        console.error('Failed to schedule assignment');
      }
    } catch (error) {
      console.error('Error scheduling assignment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-blue-400" />
            Class Schedule
          </h1>
          <p className="text-gray-400 mt-1">Manage your course assignments and exams</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-700">
            <div className="text-sm text-gray-400">Total Assignments</div>
            <div className="text-xl font-bold text-white">{scheduledAssignments.length}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-700">
            <div className="text-sm text-gray-400">Total Exams</div>
            <div className="text-xl font-bold text-white">{scheduledExams.length}</div>
          </div>
        </div>
      </div>

      {/* Course Selection with improved UI */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-white">Select Course</CardTitle>
          </div>
          <CardDescription>Choose a course to view and manage its schedule</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCourses ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : courses.length === 0 ? (
            <div className="flex items-center justify-center gap-2 text-gray-400 py-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>No courses available</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {courses.map(course => (
                <Button
                  key={course.id}
                  variant={selectedCourse === course.id ? "default" : "outline"}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`flex items-center gap-2 px-4 py-2 ${
                    selectedCourse === course.id 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-gray-900/50 hover:bg-gray-700 text-gray-300 border-gray-600"
                  }`}
                >
                  {selectedCourse === course.id && (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {course.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="bg-gray-800 border-b border-gray-700 w-full justify-start">
          <TabsTrigger 
            value="assignments" 
            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger 
            value="exams" 
            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Exams
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab Content */}
        <TabsContent value="assignments" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assignment Form Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-white">Schedule Assignment</CardTitle>
                  </div>
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                </div>
                <CardDescription>Create a new assignment for your course</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitAssignmentForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Title*
                    </label>
                    <Input
                      name="title"
                      value={assignmentForm.title}
                      onChange={handleAssignmentChange}
                      placeholder="Assignment Title"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Course Code*
                    </label>
                    <Input
                      name="course_code"
                      value={assignmentForm.course_code}
                      onChange={handleAssignmentChange}
                      placeholder="e.g. CS101"
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        Due Date*
                      </label>
                      <Input
                        type="date"
                        name="due_date"
                        value={assignmentForm.due_date}
                        onChange={handleAssignmentChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        Due Time*
                      </label>
                      <Input
                        type="time"
                        name="due_time"
                        value={assignmentForm.due_time}
                        onChange={handleAssignmentChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={assignmentForm.description}
                      onChange={handleAssignmentChange}
                      placeholder="Assignment details, requirements, etc."
                      className="bg-gray-800 border-gray-700 text-white min-h-24"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Assigned By
                    </label>
                    <Input
                      name="assigned_by"
                      value={assignmentForm.assigned_by}
                      onChange={handleAssignmentChange}
                      placeholder="Your name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="notified"
                      checked={assignmentForm.notified}
                      onChange={handleAssignmentChange as any}
                      id="notified-assignment"
                      className="rounded border-gray-700 bg-gray-800"
                    />
                    <label htmlFor="notified-assignment" className="text-sm text-gray-300">
                      Notify students
                    </label>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-300 mb-1">Assignment Guidelines</h4>
                        <ul className="text-sm text-blue-200/70 list-disc list-inside space-y-1">
                          <li>Provide clear and specific title</li>
                          <li>Set reasonable deadlines</li>
                          <li>Include detailed description</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? "Scheduling..." : "Schedule Assignment"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Scheduled Assignments Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-white">Scheduled Assignments</CardTitle>
                  </div>
                  <span className="text-sm bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                    {scheduledAssignments.length} Total
                  </span>
                </div>
                <CardDescription>View all scheduled assignments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : error ? (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700">
                      <Info className="h-5 w-5 text-gray-400" />
                      <div className="text-gray-400">No assignments created yet</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Use the form to schedule new assignments
                    </div>
                  </div>
                ) : scheduledAssignments.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div className="text-gray-400">No assignments scheduled</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Use the form to schedule new assignments
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {scheduledAssignments.map((assignment) => (
                      <div 
                        key={assignment.id} 
                        className="p-4 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-white">{assignment.title}</h3>
                          <span className="text-sm font-medium bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded">
                            {assignment.course_code}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{formatDate(assignment.date)}</span>
                          </div>
                          {assignment.time && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>{assignment.time}</span>
                            </div>
                          )}
                        </div>
                        {assignment.description && (
                          <div className="mt-2 text-sm text-gray-300 bg-gray-900/30 p-2 rounded">
                            {assignment.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exams Tab Content - Similar improvements */}
        <TabsContent value="exams" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exam Form Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-white">Schedule Exam</CardTitle>
                  </div>
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                </div>
                <CardDescription>Create a new exam for your course</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitExamForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Title*
                    </label>
                    <Input
                      name="title"
                      value={examForm.title}
                      onChange={handleExamChange}
                      placeholder="Exam Title"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Course Code*
                    </label>
                    <Input
                      name="course_code"
                      value={examForm.course_code}
                      onChange={handleExamChange}
                      placeholder="e.g. CS101"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Exam Date*
                    </label>
                    <Input
                      type="date"
                      name="exam_date"
                      value={examForm.exam_date}
                      onChange={handleExamChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        Start Time*
                      </label>
                      <Input
                        type="time"
                        name="start_time"
                        value={examForm.start_time}
                        onChange={handleExamChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        End Time*
                      </label>
                      <Input
                        type="time"
                        name="end_time"
                        value={examForm.end_time}
                        onChange={handleExamChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Location*
                    </label>
                    <Input
                      name="location"
                      value={examForm.location}
                      onChange={handleExamChange}
                      placeholder="e.g. Room 101"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={examForm.description}
                      onChange={handleExamChange}
                      placeholder="Exam details, covered topics, etc."
                      className="bg-gray-800 border-gray-700 text-white min-h-24"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="notified"
                      checked={examForm.notified}
                      onChange={handleExamChange as any}
                      id="notified-exam"
                      className="rounded border-gray-700 bg-gray-800"
                    />
                    <label htmlFor="notified-exam" className="text-sm text-gray-300">
                      Notify students
                    </label>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-300 mb-1">Exam Guidelines</h4>
                        <ul className="text-sm text-blue-200/70 list-disc list-inside space-y-1">
                          <li>Specify clear exam title and location</li>
                          <li>Set appropriate duration</li>
                          <li>Include important instructions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Schedule Exam"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 text-white border-none">
              <CardHeader className="bg-gray-800 pb-3 pt-5">
                <CardTitle>Scheduled Exams</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingData ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading exams...
                  </div>
                ) : error ? (
                  <div className="p-4 text-center">
                    <div className="text-gray-400 mb-2">No exams created yet</div>
                    <div className="text-sm text-gray-500">
                      Use the form on the left to schedule new exams
                    </div>
                  </div>
                ) : scheduledExams.length === 0 ? (
                  <div className="p-4 text-center">
                    <div className="text-gray-400 mb-2">No exams scheduled</div>
                    <div className="text-sm text-gray-500">
                      Use the form on the left to schedule new exams
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {scheduledExams.map((exam) => (
                      <div key={exam.id} className="border-b border-gray-800 p-4 hover:bg-gray-800">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium text-white">{exam.title}</h3>
                          <span className="text-sm font-medium bg-red-900/40 text-red-300 px-2 py-0.5 rounded">
                            {exam.course_code}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{formatDate(exam.date)}</span>
                          {exam.time && (
                            <>
                              <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                              <span>{exam.time}</span>
                            </>
                          )}
                        </div>
                        {exam.location && (
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{exam.location}</span>
                          </div>
                        )}
                        {exam.description && (
                          <p className="text-sm text-gray-300 mt-2">{exam.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scheduler;
