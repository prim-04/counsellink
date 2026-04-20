import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Appointment } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private appointments: Appointment[] = [
    {
      id: 1,
      studentName: 'Shad Felipe',
      studentId: '12345678',
      reason: 'Course Selection Help',
      requestedDate: '2026-04-18',
      status: 'Confirmed',
      sessionType: 'Individual',
      notes: 'Academic Concerns'
    },
    {
      id: 2,
      studentName: 'Renz Almazan',
      studentId: '2300053',
      reason: 'Career Path Discussion',
      requestedDate: '2026-04-20',
      status: 'Pending',
      sessionType: 'Individual',
      notes: 'Career & Future Planning'
    },
    {
      id: 3,
      studentName: 'Yvan Alexander Gumarang',
      studentId: '0900025',
      reason: 'Study Skills Workshop',
      requestedDate: '2026-03-15',
      status: 'Completed',
      sessionType: 'Individual',
      notes: 'Session completed successfully'
    },
        {
      id: 6,
      studentName: 'Andrew Paul Invierno',
      studentId: '2303890',
      reason: 'Study Skills Workshop',
      requestedDate: '2026-03-15',
      status: 'Completed',
      sessionType: 'Individual',
      notes: 'Session completed successfully'
    }
  ];

  constructor() {}

  getAppointments(): Observable<Appointment[]> {
    return of(this.appointments);
  }

  getAppointment(id: number): Observable<Appointment> {
    const appointment = this.appointments.find(apt => apt.id === id);
    return of(appointment || {} as Appointment);
  }

  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.max(...this.appointments.map(a => a.id), 0) + 1
    };
    this.appointments.push(newAppointment);
    return of(newAppointment);
  }

  updateStatus(id: number, status: string): Observable<Appointment> {
    const appointment = this.appointments.find(apt => apt.id === id);
    if (appointment) {
      appointment.status = status;
    }
    return of(appointment || {} as Appointment);
  }

  updateAppointment(id: number, update: Partial<Appointment>): Observable<Appointment> {
    const appointment = this.appointments.find(apt => apt.id === id);
    if (appointment) {
      Object.assign(appointment, update);
    }
    return of(appointment || {} as Appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    this.appointments = this.appointments.filter(apt => apt.id !== id);
    return of(undefined);
  }
}