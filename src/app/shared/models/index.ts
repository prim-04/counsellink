export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  studentId: string;
}

export interface Appointment {
  id: number;
  studentName: string;
  studentId: string;
  reason: string;
  requestedDate: string;
  status: string;
  sessionType?: string;
  isWalkIn?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface Student {
  id: number;
  name: string;
  studentId: string;
  program: string;
  year: number;
  lastSession: string;
}

export interface StudentInfo {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  grade: string;
  program: string;
  yearLevel: string;
  section: string;
  campus: string;
  address: string;
  landline: string;
  mobile: string;
}

export interface Notification {
  id: number;
  message: string;
  type: string;
  date: string;
}

// API Request/Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface LoginRequest {
  id: string;
  password: string;
}

export interface CreateAppointmentRequest {
  studentName: string;
  studentId: string;
  reason: string;
  requestedDate: string;
  status?: string;
  sessionType?: string;
  notes?: string;
  isWalkIn?: boolean;
}

export interface UpdateAppointmentStatusRequest {
  status: string;
}

export interface UpdateAppointmentNotesRequest {
  notes?: string;
}
