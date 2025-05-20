import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, Clock, FileText, MapPin, User } from "lucide-react";
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

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      setError(null);
      
      try {
        // Fetch assignments
        const assignmentsResponse = await axios.get<AssignmentResponse[]>(API_CONFIG.SCHEDULE.ALL_ASSIGNMENTS);
        
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
        
        // Fetch exams
        const examsResponse = await axios.get<ExamResponse[]>(API_CONFIG.SCHEDULE.ALL_EXAMS);
        
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
        console.error('Error fetching data:', err);
        setError('Failed to load schedule data. Please try again later.');
        
        // Fallback to mock data if API fails
        // Mock assignments data
        const mockAssignments = [
          { 
            id: 1, 
            title: "Database Design Project", 
            course_code: "CS301", 
            date: "2025-06-15", 
            time: "11:59 PM", 
            description: "Create an ER diagram and implement the database schema" 
          },
          { 
            id: 2, 
            title: "Python Programming Assignment", 
            course_code: "CS102", 
            date: "2025-06-10", 
            time: "11:59 PM", 
            description: "Implement a basic machine learning algorithm" 
          },
          { 
            id: 3, 
            title: "Research Paper Review", 
            course_code: "CS401", 
            date: "2025-06-20", 
            time: "11:59 PM", 
            description: "Review and summarize the assigned research paper" 
          }
        ];
        
        // Mock exams data
        const mockExams = [
          { 
            id: 1, 
            title: "Midterm Exam", 
            course_code: "CS301", 
            date: "2025-06-25", 
            time: "10:00 AM - 12:00 PM", 
            location: "Room 203", 
            description: "Covers chapters 1-5" 
          },
          { 
            id: 2, 
            title: "Final Exam", 
            course_code: "CS102", 
            date: "2025-07-15", 
            time: "1:00 PM - 3:00 PM", 
            location: "Main Hall", 
            description: "Comprehensive exam" 
          }
        ];
        
        setScheduledAssignments(mockAssignments);
        setScheduledExams(mockExams);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

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
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Class Schedule</h1>
        <p className="text-gray-200">Manage assignments and exams for your courses</p>
      </div>

      <Tabs defaultValue="assignments" className="flex-1">
        <TabsList className="bg-gray-800 border-b border-gray-700">
          <TabsTrigger value="assignments" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            Assignments
          </TabsTrigger>
          <TabsTrigger value="exams" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
            Exams
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="flex-1 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 text-white border-none">
              <CardHeader className="bg-gray-800 pb-3 pt-5">
                <CardTitle>Schedule Assignment</CardTitle>
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
            
            <Card className="bg-gray-800 text-white border-none">
              <CardHeader className="bg-gray-800 pb-3 pt-5">
                <CardTitle>Scheduled Assignments</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingData ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading assignments...
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">
                    {error}
                  </div>
                ) : scheduledAssignments.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No assignments scheduled yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {scheduledAssignments.map((assignment) => (
                      <div key={assignment.id} className="border-b border-gray-800 p-4 hover:bg-gray-800">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium text-white">{assignment.title}</h3>
                          <span className="text-sm font-medium bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">
                            {assignment.course_code}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{formatDate(assignment.date)}</span>
                          {assignment.time && (
                            <>
                              <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                              <span>{assignment.time}</span>
                            </>
                          )}
                        </div>
                        {assignment.description && (
                          <p className="text-sm text-gray-300 mt-2">{assignment.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="flex-1 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 text-white border-none">
              <CardHeader className="bg-gray-800 pb-3 pt-5">
                <CardTitle>Schedule Exam</CardTitle>
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
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? "Scheduling..." : "Schedule Exam"}
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
                  <div className="p-4 text-center text-red-500">
                    {error}
                  </div>
                ) : scheduledExams.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No exams scheduled yet
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
