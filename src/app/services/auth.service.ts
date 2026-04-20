import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'Shad Felipe',
      email: '1701027@usl.edu.ph',
      role: 'student',
      studentId: '12345678'
    },
    {
      id: 2,
      name: 'Renz Almazan',
      email: '2300053@usl.edu.ph',
      role: 'student',
      studentId: '2300053'
    },
    {
      id: 3,
      name: 'Yvan Alexander Gumarang',
      email: '0900025@usl.edu.ph',
      role: 'student',
      studentId: '0900025'
    },
    {
      id: 4,
      name: 'Jenikko Lara',
      email: 'jenikko@usl.edu',
      role: 'counselor',
      studentId: 'C002'
    },
    {
      id: 5,
      name: 'Weng Narag',
      email: 'weng@usl.edu',
      role: 'counselor',
      studentId: 'C001'
    },    
    {
      id: 6,
      name: 'Roy Ubina',
      email: 'roy@usl.edu',
      role: 'counselor',
      studentId: 'C003'
    }
  ];

  constructor() {}

  login(id: string, password: string): Observable<User> {
    if (password !== '123') {
      return throwError(() => new Error('Invalid credentials'));
    }

    const user = this.mockUsers.find(u => u.studentId === id);
    if (user) {
      return of(user);
    }

    return throwError(() => new Error('User not found'));
  }
}