import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../shared/models';
import { ROLES } from '../shared/constants/app-constants';

/**
 * Login Component
 * 
 * Test Credentials (Mock Database):
 * - Student: ID: S001, Password: password123
 * - Counselor: ID: C001, Password: password123
 * - Counselor: ID: C002, Password: password123
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginId = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  activeModal: 'terms' | 'disclaimer' | 'contact' | 'faq' | 'forgot' | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.validateInput()) {
      this.isLoading = false;
      return;
    }

    this.authService.login(this.loginId, this.password).subscribe({
      next: (user: User) => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.navigateBasedOnRole(user.role);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private validateInput(): boolean {
    if (!this.loginId.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both ID and password';
      return false;
    }
    return true;
  }

  private navigateBasedOnRole(role: string) {
    if (role === ROLES.STUDENT) {
      this.router.navigate(['/student-dashboard']);
    } else if (role === ROLES.COUNSELOR) {
      this.router.navigate(['/counselor-dashboard']);
    } else {
      this.errorMessage = 'Unknown user role';
    }
  }

  openTermsModal(): void {
    this.openModal('terms');
  }

openModal(type: 'terms' | 'disclaimer' | 'contact' | 'faq' | 'forgot'): void {
    this.activeModal = type;
  }

  closeModal(): void {
    this.activeModal = null;
  }
}
