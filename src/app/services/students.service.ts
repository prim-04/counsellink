import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private students: Student[] = [
    {
      id: 1,
      name: 'John Doe',
      studentId: 'S001',
      program: 'BSIT',
      year: 3,
      lastSession: '2026-04-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      studentId: 'S002',
      program: 'BSIT',
      year: 2,
      lastSession: '2026-04-10'
    },
    {
      id: 3,
      name: 'Bob Wilson',
      studentId: 'S003',
      program: 'BSCS',
      year: 4,
      lastSession: '2026-04-20'
    }
  ];

  constructor() {}

  getStudents(): Observable<Student[]> {
    return of(this.students);
  }

  getStudent(id: string): Observable<Student> {
    const student = this.students.find(s => s.studentId === id);
    return of(student || {} as Student);
  }
}