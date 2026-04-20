export const API_CONFIG = {
  baseUrl: 'http://localhost:5251/api',
  endpoints: {
    auth: {
      login: '/auth/login'
    },
    appointments: {
      list: '/appointments',
      detail: '/appointments/:id',
      updateStatus: '/appointments/:id/status',
      updateNotes: '/appointments/:id',
      delete: '/appointments/:id'
    },
    students: {
      list: '/students',
      detail: '/students/:id'
    },
    notifications: {
      list: '/notifications',
      create: '/notifications',
      delete: '/notifications/:id'
    }
  }
};

export const ROLES = {
  STUDENT: 'student',
  COUNSELOR: 'counselor'
};

export const APPOINTMENT_STATUSES = ['Pending', 'Approved', 'Completed', 'Cancelled'] as const;
export const SESSION_TYPES = ['Individual', 'Group'] as const;
export const NOTIFICATION_TYPES = ['info', 'warning', 'success'] as const;
