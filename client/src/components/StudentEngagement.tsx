import React from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';

const engagementMetrics = [
  {
    id: 1,
    title: "Course Completion Rate",
    value: 78,
    description: "Students who completed all course requirements",
  },
  {
    id: 2,
    title: "Assignment Submission Rate",
    value: 85,
    description: "Timely submission of assignments",
  },
  {
    id: 3,
    title: "Discussion Participation",
    value: 62,
    description: "Active participation in course discussions",
  },
  {
    id: 4,
    title: "Quiz Performance",
    value: 72,
    description: "Average quiz scores across all students",
  },
];

export const StudentEngagement = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {engagementMetrics.map((metric) => (
        <Card key={metric.id}>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{metric.title}</h3>
                <span className="text-sm font-medium">{metric.value}%</span>
              </div>
              <Progress value={metric.value} className="h-2" />
              <p className="text-sm text-gray-500">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 