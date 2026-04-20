import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard';
import { CounselorDashboardComponent } from './counselor-dashboard/counselor-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'counselor-dashboard', component: CounselorDashboardComponent }
];
