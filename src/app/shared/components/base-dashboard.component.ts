import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models';

/**
 * Base component for dashboard pages.
 * Handles common functionality like user authentication checks and logout.
 */
@Component({
  template: ''
})
export class BaseDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(protected router: Router) {}

  ngOnInit() {
    this.loadCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  protected loadCurrentUser(): void {
    if (typeof sessionStorage !== 'undefined') {
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        try {
          this.currentUser = JSON.parse(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.logout();
        }
      }
    }
  }

  logout(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }
}
