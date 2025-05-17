import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";

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

const Scheduler = () => {
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

  const handleExamChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setExamForm({
      ...examForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAssignmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAssignmentForm({
      ...assignmentForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const submitExamForm = async () => {
    const response = await fetch('localhost:8008/api/exams/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(examForm)
    });
    const data = await response.json();
    console.log('Exam scheduled:', data);
  };

  const submitAssignmentForm = async () => {
    const response = await fetch('localhost:8008/api/assignments/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assignmentForm)
    });
    const data = await response.json();
    console.log('Assignment scheduled:', data);
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Schedule Exam</h2>
          {Object.entries(examForm).map(([key, value]) => (
            key !== 'notified' ? (
              <Input
                key={key}
                type="text"
                name={key}
                value={value}
                onChange={handleExamChange}
                placeholder={key.replace('_', ' ')}
              />
            ) : (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={key}
                  checked={value}
                  onChange={handleExamChange}
                />
                <span>{key}</span>
              </label>
            )
          ))}
          <Button onClick={submitExamForm}>Submit Exam</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Schedule Assignment</h2>
          {Object.entries(assignmentForm).map(([key, value]) => (
            key !== 'notified' ? (
              <Input
                key={key}
                type="text"
                name={key}
                value={value}
                onChange={handleAssignmentChange}
                placeholder={key.replace('_', ' ')}
              />
            ) : (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={key}
                  checked={value}
                  onChange={handleAssignmentChange}
                />
                <span>{key}</span>
              </label>
            )
          ))}
          <Button onClick={submitAssignmentForm}>Submit Assignment</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scheduler;
