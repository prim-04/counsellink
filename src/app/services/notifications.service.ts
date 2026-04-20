import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notification } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifications: Notification[] = [
    {
      id: 1,
      message: 'Your appointment with Ms. Johnson is confirmed for tomorrow at 2:00 PM',
      type: 'success',
      date: new Date().toISOString()
    },
    {
      id: 2,
      message: 'New academic calendar available for next semester',
      type: 'info',
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      message: 'Please update your emergency contact information',
      type: 'warning',
      date: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return of(this.notifications);
  }

  createNotification(message: string, type: string): Observable<Notification> {
    const newNotification: Notification = {
      id: Math.max(...this.notifications.map(n => n.id), 0) + 1,
      message,
      type,
      date: new Date().toISOString()
    };
    this.notifications.push(newNotification);
    return of(newNotification);
  }

  deleteNotification(id: number): Observable<void> {
    this.notifications = this.notifications.filter(n => n.id !== id);
    return of(undefined);
  }
}