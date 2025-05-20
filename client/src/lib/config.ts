// Base URLs for different services
const BASE_URLS = {
  // Production URLs
  PROD: {
    API_GATEWAY: 'https://api.campus-management.ovindu.com',
    LOGIN: 'https://login.campus-management.ovindu.com',
    VEHICLE_DETECTOR: 'https://vehicle-detector.campus-management.ovindu.com',
    AUTH: 'https://auth.campus-management.ovindu.com',
    LOGGER: 'https://logger.campus-management.ovindu.com',
    DASHBOARD: 'https://dashboard.campus-management.ovindu.com',
    ENROLLMENT: 'https://enrollment.campus-management.ovindu.com',
    ATTENDANCE: 'https://attendance.campus-management.ovindu.com',
    NOTIFICATIONS: 'https://notifications.campus-management.ovindu.com',
    SCHEDULE: 'https://schedule.campus-management.ovindu.com',
    RESOURCES: 'https://resources.campus-management.ovindu.com',
    STUDENT: 'https://student.campus-management.ovindu.com'
  },

  // Development URLs (matching your Docker ports)
  DEV: {
    API_GATEWAY: 'http://localhost:8000',
    LOGIN: 'http://localhost:8100',
    VEHICLE_DETECTOR: 'http://localhost:8001',
    AUTH: 'http://localhost:8002',
    LOGGER: 'http://localhost:8003',
    DASHBOARD: 'http://localhost:8004',
    ENROLLMENT: 'http://localhost:8005',
    ATTENDANCE: 'http://localhost:8006',
    NOTIFICATIONS: 'http://localhost:8007',
    SCHEDULE: 'http://localhost:8008',
    RESOURCES: 'http://localhost:8010',
    STUDENT: 'http://localhost:8020'
  }
};

// Use development URLs by default, can be overridden by environment
const currentEnv = import.meta.env.VITE_STATUS_ENV === 'production' ? 'PROD' : 'DEV';
const urls = BASE_URLS[currentEnv];

// API Endpoints configuration
export const API_CONFIG = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${urls.LOGIN}/login`,
    LOGOUT: `${urls.LOGIN}/logout`,
    USER: `${urls.LOGIN}/user`,
  },

  // Course endpoints
  COURSES: {
    ALL: `${urls.API_GATEWAY}/courses/all`,
    UNASSIGNED: `${urls.API_GATEWAY}/courses/all-yet-to-assign`,
    ENROLLED: `${urls.API_GATEWAY}/courses/enrolled`,
    ELIGIBLE: `${urls.API_GATEWAY}/courses/eligible`,
    YET_TO_ENROLL: `${urls.API_GATEWAY}/courses/eligible-yet-to-enroll`,
    LECTURERS: `${urls.API_GATEWAY}/courses/lecturers`,
    ENROLL: `${urls.API_GATEWAY}/courses/enroll`,
    UNENROLL: `${urls.API_GATEWAY}/courses/unenroll`,
    ADD_COURSE: `${urls.API_GATEWAY}/courses/add-new-course`,
  },

  // Student course profile endpoints
  STUDENT_COURSES: {
    PROFILE: `${urls.STUDENT}/users`,  // Base URL, will append /{userId}/course-profile in component
    RESULTS: `${urls.STUDENT}/users`,  // Base URL, will append /{userId}/course-results in component
  },

  // Resource endpoints
  RESOURCES: {
    ALL: `${urls.RESOURCES}/get-resources`,
    BOOKINGS: `${urls.RESOURCES}/get-bookings`,
    USER_BOOKINGS: `${urls.RESOURCES}/get-bookings-user`,
    CREATE_BOOKING: `${urls.RESOURCES}/create-booking`,
    DELETE_BOOKING: `${urls.RESOURCES}/delete-booking`,
    UPDATE_BOOKING: `${urls.RESOURCES}/booking-update`,
    INSERT_RESOURCE: `${urls.RESOURCES}/resource-insert`,
    UPDATE_RESOURCE: `${urls.RESOURCES}/resource-update`,
    DELETE_RESOURCE: `${urls.RESOURCES}/resource-delete`,
    GET_PEOPLE: `${urls.RESOURCES}/get-people`,
    ASSIGN_PEOPLE: `${urls.RESOURCES}/assign-people`,
  },

  REPORTS: {
    COURSE_MANAGEMENT: `${urls.STUDENT}/reports/course-management`,
    ACADEMIC_PERFORMANCE: `${urls.STUDENT}/reports/academic-performance`,
  },

  // Schedule endpoints
  SCHEDULE: {
    ALL_ASSIGNMENTS: `${urls.API_GATEWAY}/api-gateway/schedule-manager/get-all-assignments`,
    ASSIGNMENTS: `${urls.API_GATEWAY}/api-gateway/schedule-manager/schedule-assignment`,
    ALL_EXAMS: `${urls.SCHEDULE}/api-gateway/schedule-manager/get-all-exams`,
    EXAMS: `${urls.SCHEDULE}/api-gateway/schedule-manager/schedule-exam`,

  },

  // Attendance endpoints
  ATTENDANCE: {
    MANUAL: `${urls.ATTENDANCE}/manual`,
  },

  // Vehicle Detector endpoints
  VEHICLE: {
    DETECT: `${urls.VEHICLE_DETECTOR}/detect`,
  },

  // Authorization endpoints
  AUTHORIZATION: {
    VERIFY: `${urls.AUTH}/verify`,
  },

  // Logger endpoints
  LOGGER: {
    LOG: `${urls.LOGGER}/log`,
  },

  // Dashboard endpoints
  DASHBOARD: {
    STATS: `${urls.DASHBOARD}/stats`,
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    SEND: `${urls.NOTIFICATIONS}/send`,
  },

  // Recommendations endpoints
  RECOMMENDATIONS: {
    STUDY: `${urls.STUDENT}/recommendations/study`,  // Base URL, will append /{userId}/ in component
    COURSE: `${urls.STUDENT}/recommendations/course`,  // Base URL, will append /{userId}/ in component
  },
};

// Helper function to get the current environment's base URL
export const getBaseUrl = (service: keyof typeof BASE_URLS.DEV) => {
  return BASE_URLS[currentEnv][service];
};

export default API_CONFIG;