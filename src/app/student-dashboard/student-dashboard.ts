import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../services/appointments.service';
import { NotificationsService } from '../services/notifications.service';
import { BaseDashboardComponent } from '../shared/components/base-dashboard.component';
import { Appointment, Notification, StudentInfo } from '../shared/models';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboardComponent extends BaseDashboardComponent implements OnInit {
  studentInfo: StudentInfo = {
    name: '',
    email: '',
    phone: '(555) 123-4567',
    studentId: '',
    grade: '12th Grade',
    program: 'BSIT',
    yearLevel: '3',
    section: 'A',
    campus: 'Tuguegarao City',
    address: '123 University Avenue, Tuguegarao City',
    landline: '(078) 304-1234',
    mobile: '0917-123-4567'
  };

  editInfo: StudentInfo = { ...this.studentInfo };
  showEditModal = false;

  concerns = [
    { id: 1, type: 'Academic Concerns' },
    { id: 2, type: 'Career & Future Planning' },
    { id: 3, type: 'Personal & Wellness Issues' },
    { id: 4, type: 'Financial Assistance' },
    { id: 5, type: 'Social & Relationship Issues' }
  ];

  selectedConcern = '';
  appointmentReason = '';
  appointmentDate = '';
  appointmentTime = '';
  requestedAppointments: any[] = [];
  appointmentHistory: any[] = [];
  isLoadingAppointments = false;
  isLoadingNotifications = false;
  currentPage = 'personal-data';
  currentModal: 'disclaimer' | 'contact' | 'faq' | null = null;
  isSidebarOpen = false;
  semesterInfo = '2nd Semester SY 2025 - 2026 : Officially Enrolled';

  familyBackground = [
    { name: 'My Mother Name', relationship: 'Mother', landline: '', mobile: '' },
    { name: 'My Father Name', relationship: 'Father', landline: '', mobile: '' }
  ];

  educationBackground = {
    school: 'University of Saint Louis - Tuguegarao',
    degree: 'Bachelor of Science in Information Technology',
    yearGraduated: '2024',
    honors: 'Cum Laude'
  };

  notifications: Notification[] = [];

  constructor(
    router: Router,
    private appointmentsService: AppointmentsService,
    private notificationsService: NotificationsService
  ) {
    super(router);
  }

  override ngOnInit() {
    super.ngOnInit();
    if (this.currentUser) {
      this.initializeStudentInfo();
      this.loadData();
    }
  }

  private initializeStudentInfo(): void {
    this.studentInfo.name = this.currentUser?.name || '';
    this.studentInfo.studentId = String(this.currentUser?.studentId || this.currentUser?.id || '');
    this.studentInfo.email = `${this.currentUser?.name?.toLowerCase().replace(/\s+/g, '.')}@student.usl.edu` || '';
    this.editInfo = { ...this.studentInfo };
  }

  loadData(): void {
    this.loadAppointments();
    this.loadNotifications();
  }

  private loadAppointments(): void {
    this.isLoadingAppointments = true;
    this.appointmentsService.getAppointments().subscribe({
      next: (appointments) => {
        this.requestedAppointments = appointments
          .filter(apt => apt.status !== 'Completed')
          .map(apt => ({
            id: apt.id,
            concern: apt.reason,
            reason: apt.reason,
            date: apt.requestedDate,
            time: '2:00 PM',
            status: apt.status,
            assignedCounselor: 'To be assigned'
          }));

        this.appointmentHistory = appointments
          .filter(apt => apt.status === 'Completed')
          .map(apt => ({
            id: apt.id,
            concern: apt.reason,
            reason: apt.reason,
            date: apt.requestedDate,
            time: '2:00 PM',
            status: apt.status,
            assignedCounselor: apt.notes || 'Assigned Counselor',
            outcome: apt.notes || 'Session completed'
          }));

        this.isLoadingAppointments = false;
      },
      error: (error) => {
        console.error('Failed to load appointments:', error);
        this.isLoadingAppointments = false;
      }
    });
  }

  private loadNotifications(): void {
    this.isLoadingNotifications = true;
    this.notificationsService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.isLoadingNotifications = false;
      },
      error: (error) => {
        console.error('Failed to load notifications:', error);
        this.isLoadingNotifications = false;
      }
    });
  }

  openEditModal() {
    this.editInfo = { ...this.studentInfo };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  savePersonalInfo() {
    this.studentInfo = { ...this.editInfo };
    this.showEditModal = false;
    // In real app, save to backend
  }

  navigateTo(page: string) {
    this.currentPage = page;
    if (page === 'appointments') {
      this.selectedConcern = '';
      this.appointmentReason = '';
      this.appointmentDate = '';
      this.appointmentTime = '';
    }
  }

  openModal(type: 'disclaimer' | 'contact' | 'faq'): void {
    this.currentModal = type;
  }

  closeModal(): void {
    this.currentModal = null;
  }

  createAppointment() {
    if (!this.isValidAppointmentForm()) {
      return;
    }

    const concern = this.concerns.find(c => c.id.toString() === this.selectedConcern);
    const appointment: Omit<Appointment, 'id'> = {
      studentName: this.studentInfo.name,
      studentId: this.studentInfo.studentId,
      reason: this.appointmentReason,
      requestedDate: this.appointmentDate,
      status: 'Pending',
      sessionType: 'Individual',
      notes: concern?.type
    };

    this.appointmentsService.createAppointment(appointment).subscribe({
      next: (newAppointment) => {
        this.requestedAppointments.unshift({
          id: newAppointment.id,
          concern: concern?.type,
          reason: this.appointmentReason,
          date: this.appointmentDate,
          time: this.appointmentTime,
          status: 'Pending',
          assignedCounselor: 'To be assigned'
        });
        this.clearAppointmentForm();
      },
      error: (error) => {
        console.error('Failed to create appointment:', error);
      }
    });
  }

  private isValidAppointmentForm(): boolean {
    return !!(this.selectedConcern && this.appointmentReason.trim() && this.appointmentDate && this.appointmentTime);
  }

  private clearAppointmentForm(): void {
    this.selectedConcern = '';
    this.appointmentReason = '';
    this.appointmentDate = '';
    this.appointmentTime = '';
  }

  cancelAppointment(id: number) {
    this.requestedAppointments = this.requestedAppointments.filter(apt => apt.id !== id);
  }

  dismissNotification(id: number) {
    this.notificationsService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(notif => notif.id !== id);
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
