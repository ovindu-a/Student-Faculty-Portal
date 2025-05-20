import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Generate current date in a readable format
const formatDate = (): string => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Generate PDF from an HTML element
export const generatePdfFromElement = async (
  element: HTMLElement, 
  fileName: string = 'report.pdf'
): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#111827', // Dark background matching the UI
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Generate a course management PDF report
export const generateCourseManagementReport = async (
  studentName: string,
  studentEmail: string,
  overallAvgScore: number,
  totalCoursesCompleted: number,
  totalTimeSpent: number,
  courseProfiles: any[]
): Promise<void> => {
  const pdf = new jsPDF();
  let yPos = 10;
  
  // Header
  pdf.setFillColor(13, 37, 76); // Dark blue header
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.text('Course Management Report', 105, yPos + 10, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(`Generated on: ${formatDate()}`, 105, yPos + 20, { align: 'center' });
  
  yPos = 45;
  
  // Student Information
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.text('Student Information', 14, yPos);
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.text(`Name: ${studentName}`, 14, yPos);
  yPos += 7;
  pdf.text(`Email: ${studentEmail}`, 14, yPos);
  
  yPos += 15;
  
  // Overall Stats
  pdf.setFillColor(240, 240, 240);
  pdf.rect(14, yPos, 180, 25, 'F');
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Overall Performance Summary', 18, yPos + 7);
  
  yPos += 15;
  pdf.text(`Average Score: ${overallAvgScore.toFixed(2)}`, 18, yPos);
  pdf.text(`Courses Completed: ${totalCoursesCompleted}`, 80, yPos);
  pdf.text(`Total Hours: ${totalTimeSpent}`, 150, yPos);
  
  yPos += 15;
  
  // Courses Table
  pdf.setFontSize(14);
  pdf.text('Course Details', 14, yPos);
  
  yPos += 7;
  
  // Table headers
  pdf.setFillColor(220, 220, 220);
  pdf.rect(14, yPos, 180, 8, 'F');
  
  pdf.setFontSize(11);
  pdf.text('Course Name', 16, yPos + 5.5);
  pdf.text('Average Score', 85, yPos + 5.5);
  pdf.text('Hours Spent', 125, yPos + 5.5);
  pdf.text('Completion', 165, yPos + 5.5);
  
  yPos += 8;
  
  // Table rows
  courseProfiles.forEach((course, index) => {
    if (yPos > 270) { // Add new page if needed
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFillColor(index % 2 === 0 ? 245 : 255, index % 2 === 0 ? 245 : 255, index % 2 === 0 ? 245 : 255);
    pdf.rect(14, yPos, 180, 8, 'F');
    
    const courseName = course.course_details.name;
    const avgScore = course.course_profile.avg_score;
    const timeSpent = course.course_profile.total_time_spent;
    const completed = course.course_profile.courses_completed;
    
    pdf.text(courseName.length > 30 ? courseName.substring(0, 30) + '...' : courseName, 16, yPos + 5.5);
    pdf.text(`${avgScore.toFixed(1)}%`, 85, yPos + 5.5);
    pdf.text(`${timeSpent} hours`, 125, yPos + 5.5);
    pdf.text(`${completed} modules`, 165, yPos + 5.5);
    
    yPos += 8;
  });
  
  yPos += 10;
  
  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('This report is auto-generated from the Student Portal. For any discrepancies, please contact support.', 105, 285, { align: 'center' });
  
  pdf.save(`${studentName.replace(/\s+/g, '-')}_Course_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Generate an academic performance PDF report
export const generateAcademicPerformanceReport = async (
  overallAverage: number,
  courseResults: any[],
  recommendations: any,
  studentName: string = 'Student'
): Promise<void> => {
  const pdf = new jsPDF();
  let yPos = 10;
  
  // Header
  pdf.setFillColor(13, 37, 76); // Dark blue header
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.text('Academic Performance Report', 105, yPos + 10, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(`Generated on: ${formatDate()}`, 105, yPos + 20, { align: 'center' });
  
  yPos = 45;
  
  // Overall Performance
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.text('Overall Academic Performance', 14, yPos);
  
  yPos += 10;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(14, yPos, 180, 20, 'F');
  
  pdf.setFontSize(14);
  pdf.text(`Overall Average Score: ${overallAverage.toFixed(2)}`, 18, yPos + 7);
  
  const gradeLetter = getGradeLetter(overallAverage);
  pdf.text(`Grade: ${gradeLetter}`, 18, yPos + 17);
  
  yPos += 30;
  
  // Course Results
  pdf.setFontSize(16);
  pdf.text('Course Results', 14, yPos);
  yPos += 10;
  
  // Table headers
  pdf.setFillColor(220, 220, 220);
  pdf.rect(14, yPos, 180, 8, 'F');
  
  pdf.setFontSize(11);
  pdf.text('Course Name', 16, yPos + 5.5);
  pdf.text('Score', 125, yPos + 5.5);
  pdf.text('Grade', 165, yPos + 5.5);
  
  yPos += 8;
  
  // Course Results Table
  courseResults.forEach((course, index) => {
    if (yPos > 250) { // Add new page if needed
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFillColor(index % 2 === 0 ? 245 : 255, index % 2 === 0 ? 245 : 255, index % 2 === 0 ? 245 : 255);
    pdf.rect(14, yPos, 180, 8, 'F');
    
    const courseName = course.course_name;
    const score = course.average_score;
    const grade = getGradeLetter(score);
    
    pdf.text(courseName.length > 50 ? courseName.substring(0, 50) + '...' : courseName, 16, yPos + 5.5);
    pdf.text(`${score.toFixed(2)}%`, 125, yPos + 5.5);
    pdf.text(grade, 165, yPos + 5.5);
    
    yPos += 8;
  });
  
  yPos += 15;
  
  // Recommendations
  if (recommendations && recommendations.recommendations) {
    if (yPos > 200) { // Add new page if needed
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFontSize(16);
    pdf.text('Recommendations', 14, yPos);
    yPos += 10;
    
    pdf.setFontSize(12);
    const overallRecommendation = recommendations.recommendations.overall_recommendation || '';
    
    // Split long text into multiple lines
    const splitText = pdf.splitTextToSize(overallRecommendation, 170);
    pdf.text(splitText, 14, yPos);
    
    yPos += splitText.length * 7 + 10;
  }
  
  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('This report is auto-generated from the Student Portal. For any discrepancies, please contact support.', 105, 285, { align: 'center' });
  
  pdf.save(`${studentName.replace(/\s+/g, '-')}_Academic_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Helper function to get grade letter
function getGradeLetter(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
} 