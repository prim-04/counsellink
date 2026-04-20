import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../constants/app-constants';
import { ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  protected apiBaseUrl = API_CONFIG.baseUrl;

  constructor(protected http: HttpClient) {}

  protected get<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.apiBaseUrl}${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  protected post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.apiBaseUrl}${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  protected put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.apiBaseUrl}${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  protected delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.apiBaseUrl}${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
