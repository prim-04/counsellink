import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../services/appointments.service';
import { StudentsService } from '../services/students.service';
import { NotificationsService } from '../services/notifications.service';
import { Appointment, Student, Notification, User } from '../shared/models';
import { BaseDashboardComponent } from '../shared/components/base-dashboard.component';

@Component({
  selector: 'app-counselor-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './counselor-dashboard.html',
  styleUrls: ['./counselor-dashboard.css']
})
export class CounselorDashboardComponent extends BaseDashboardComponent implements OnInit {
  counselorName = '';
  specialty = 'Academic Counseling';

  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;
  appointmentNotes = '';
  isLoadingAppointments = false;

  showAppointmentModal = false;
  appointmentModalStep: 'choice' | 'schedule' | 'walkin' = 'choice';
  appointmentForm = {
    studentName: '',
    studentId: '',
    reason: '',
    requestedDate: '',
    sessionType: 'Individual' as 'Individual' | 'Group',
    notes: ''
  };

  walkInSearchTerm = '';
  selectedWalkInStudent: Student | null = null;
  walkInNotes = '';

  notifications: Notification[] = [];
  currentPage = 'dashboard';
  currentDate = new Date();
  isSidebarOpen = false;
  currentModal: 'disclaimer' | 'contact' | 'faq' | null = null;

  activeStudents: Student[] = [];
  isLoadingStudents = false;

  // Static data for dashboard display (can be moved to service later)
  recentActivities = [
    { icon: '📅', text: 'Approved appointment with Weng Narag', time: '2 hours ago' },
    { icon: '✅', text: 'Completed session with Jenniko Lara', time: '1 day ago' },
    { icon: '📝', text: 'Added notes to Bob Wilson\'s profile', time: '2 days ago' },
    { icon: '📧', text: 'Sent follow-up email to 3 students', time: '3 days ago' }
  ];

  monthlyStats = {
    sessions: 24,
    students: 18,
    avgRating: 4.7
  };

  commonConcerns = [
    { name: 'Academic Performance', count: 12, percentage: 40 },
    { name: 'Career Guidance', count: 8, percentage: 27 },
    { name: 'Personal Issues', count: 6, percentage: 20 },
    { name: 'Time Management', count: 3, percentage: 10 },
    { name: 'Other', count: 1, percentage: 3 }
  ];

  constructor(
    router: Router,
    private appointmentsService: AppointmentsService,
    private studentsService: StudentsService,
    private notificationsService: NotificationsService
  ) {
    super(router);
  }

  override ngOnInit() {
    super.ngOnInit();
    if (this.currentUser) {
      this.initializeDashboard();
    }
  }

  private initializeDashboard(): void {
    this.counselorName = this.currentUser?.name || '';
    this.setSpecialtyBasedOnId(this.currentUser?.studentId);
    this.loadData();
  }

  private setSpecialtyBasedOnId(counselorId?: string): void {
    switch (counselorId) {
      case 'C001':
        this.specialty = 'Academic Counseling';
        break;
      case 'C002':
        this.specialty = 'Career Guidance';
        break;
      case 'C003':
        this.specialty = 'Personal Counseling';
        break;
      default:
        this.specialty = 'General Counseling';
    }
  }

  loadData(): void {
    this.loadAppointments();
    this.loadStudents();
    this.loadNotifications();
  }

  private loadAppointments(): void {
    this.isLoadingAppointments = true;
    this.appointmentsService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoadingAppointments = false;
      },
      error: (error) => {
        console.error('Failed to load appointments:', error);
        this.isLoadingAppointments = false;
      }
    });
  }

  private loadStudents(): void {
    this.isLoadingStudents = true;
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.activeStudents = students;
        this.isLoadingStudents = false;
      },
      error: (error) => {
        console.error('Failed to load students:', error);
        this.isLoadingStudents = false;
      }
    });
  }

  private loadNotifications(): void {
    this.notificationsService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Failed to load notifications:', error);
      }
    });
  }

  updateAppointmentStatus(appointment: Appointment, status: string): void {
    this.appointmentsService.updateStatus(appointment.id, status).subscribe({
      next: (updated) => {
        appointment.status = updated.status;
        if (status === 'Approved') {
          appointment.notes = 'Appointment approved. Please check your schedule.';
        }
      },
      error: (error) => {
        console.error('Failed to update appointment status:', error);
      }
    });
  }

  openAddAppointmentModal(): void {
    this.showAppointmentModal = true;
    this.appointmentModalStep = 'choice';
    this.resetAppointmentForm();
  }

  closeAppointmentModal(): void {
    this.showAppointmentModal = false;
    this.appointmentModalStep = 'choice';
    this.resetAppointmentForm();
  }

  private resetAppointmentForm(): void {
    this.appointmentForm = {
      studentName: '',
      studentId: '',
      reason: '',
      requestedDate: '',
      sessionType: 'Individual',
      notes: ''
    };
    this.walkInSearchTerm = '';
    this.selectedWalkInStudent = null;
    this.walkInNotes = '';
  }

  selectAppointmentOption(option: 'schedule' | 'walkin'): void {
    this.appointmentModalStep = option;
  }

  scheduleNewAppointment(): void {
    if (!this.isValidAppointmentForm()) {
      return;
    }

    const appointment: Omit<Appointment, 'id'> = {
      studentName: this.appointmentForm.studentName,
      studentId: this.appointmentForm.studentId,
      reason: this.appointmentForm.reason,
      requestedDate: this.appointmentForm.requestedDate,
      status: 'Pending',
      sessionType: this.appointmentForm.sessionType,
      notes: this.appointmentForm.notes
    };

    this.appointmentsService.createAppointment(appointment).subscribe({
      next: (newAppointment) => {
        this.appointments.unshift(newAppointment);
        this.closeAppointmentModal();
      },
      error: (error) => {
        console.error('Failed to create appointment:', error);
      }
    });
  }

  private isValidAppointmentForm(): boolean {
    return !!(this.appointmentForm.studentName.trim() &&
      this.appointmentForm.studentId.trim() &&
      this.appointmentForm.requestedDate.trim());
  }

  filteredWalkInStudents(): Student[] {
    const term = this.walkInSearchTerm.trim().toLowerCase();
    if (!term) {
      return [];
    }
    return this.activeStudents.filter(student =>
      student.name.toLowerCase().includes(term) ||
      student.studentId.toLowerCase().includes(term)
    );
  }

  selectWalkInStudent(student: Student): void {
    this.selectedWalkInStudent = student;
  }

  completeWalkInSession(): void {
    if (!this.selectedWalkInStudent || !this.walkInNotes.trim()) {
      return;
    }

    const appointment: Omit<Appointment, 'id'> = {
      studentName: this.selectedWalkInStudent.name,
      studentId: this.selectedWalkInStudent.studentId,
      reason: 'Walk-in counseling session',
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Completed',
      sessionType: 'Individual',
      isWalkIn: true,
      notes: this.walkInNotes
    };

    this.appointmentsService.createAppointment(appointment).subscribe({
      next: (newAppointment) => {
        this.appointments.unshift(newAppointment);
        this.closeAppointmentModal();
      },
      error: (error) => {
        console.error('Failed to create walk-in session:', error);
      }
    });
  }

  viewAppointmentDetails(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.appointmentNotes = appointment.notes || '';
  }

  saveAppointmentNotes(): void {
    if (!this.selectedAppointment) {
      return;
    }

    this.appointmentsService.updateAppointment(this.selectedAppointment.id, {
      notes: this.appointmentNotes
    }).subscribe({
      next: (updated) => {
        this.selectedAppointment!.notes = updated.notes;
        this.closeAppointmentDetails();
      },
      error: (error) => {
        console.error('Failed to update appointment notes:', error);
      }
    });
  }

  closeAppointmentDetails(): void {
    this.selectedAppointment = null;
  }

  navigateTo(page: string): void {
    this.currentPage = page;
  }

  openModal(type: 'disclaimer' | 'contact' | 'faq'): void {
    this.currentModal = type;
  }

  closeModal(): void {
    this.currentModal = null;
  }

  getTodaysAppointments(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(apt =>
      apt.status === 'Approved' &&
      apt.requestedDate.startsWith(today)
    ).length;
  }

  getPendingAppointments(): number {
    return this.appointments.filter(apt => apt.status === 'Pending').length;
  }

  getActiveStudentsCount(): number {
    return this.activeStudents.length;
  }

  viewStudentProfile(student: Student): void {
    console.log('Viewing student profile:', student);
  }

  dismissNotification(id: number): void {
    this.notificationsService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      },
      error: (error) => {
        console.error('Failed to delete notification:', error);
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}