import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Auth } from '@models/auth';
import { ApiResponse, ApiResponseError } from '@models/ApiResponse';
import { AuthUser, User } from '@models/user';

// Define the specific success response structure for login
export interface LoginSuccessData {
  token: string;
  user: AuthUser;
}

// Interface for reset password with token
export interface ResetPasswordWithToken {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.API_URL;
  private http = inject(HttpClient);

  login(model: Auth): Observable<ApiResponse<LoginSuccessData>> {
    return this.http
      .post<ApiResponse<LoginSuccessData>>(`${this.apiUrl}/auth/login`, model)
      .pipe(
        tap((response) => console.log('Login API Response:', response)), // Log response
        catchError(this.handleError), // Centralized basic error logging
      );
  }

  register(model: Auth): Observable<ApiResponse<any>> {
    // Assuming register might return different data or null
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/auth/register`, model)
      .pipe(
        tap((response) => console.log('Register API Response:', response)), // Log response
        catchError(this.handleError), // Centralized basic error logging
      );
  }

  resetPassword({
    currentPassword,
    newPassword,
  }: any): Observable<ApiResponse<any>> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/auth/resetpassword`, {
        currentPassword,
        newPassword,
      })
      .pipe(
        tap((response) => console.log('Reset Password Response:', response)),
        catchError(this.handleError),
      );
  }

  forgotPassword(email: string): Observable<ApiResponse<{ message: string }>> {
    return this.http
      .post<
        ApiResponse<{ message: string }>
      >(`${this.apiUrl}/auth/forgot-password`, { email })
      .pipe(
        tap((response) => console.log('Forgot Password Response:', response)),
        catchError(this.handleError),
      );
  }

  authenticateByAccessCode(
    email: string,
  ): Observable<ApiResponse<{ message: string }>> {
    return this.http
      .post<
        ApiResponse<{ message: string }>
      >(`${this.apiUrl}/auth/generate-access-code`, { email })
      .pipe(
        tap((response) =>
          console.log('Generate access code Response:', response),
        ),
        catchError(this.handleError),
      );
  }

  verifyAccessCode(
    email: string,
    accessCode: string,
  ): Observable<ApiResponse<LoginSuccessData>> {
    return this.http
      .post<
        ApiResponse<LoginSuccessData>
      >(`${this.apiUrl}/auth/verify-access-code`, { email, accessCode })
      .pipe(
        tap((response) => console.log('Forgot Password Response:', response)),
        catchError(this.handleError),
      );
  }

  resetPasswordWithToken(
    resetData: ResetPasswordWithToken,
  ): Observable<ApiResponse<{ message: string }>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<
        ApiResponse<{ message: string }>
      >(`${this.apiUrl}/auth/reset-password-token`, resetData, { headers })
      .pipe(
        tap((response) =>
          console.log('Reset Password with Token Response:', response),
        ),
        catchError(this.handleError),
      );
  }

  validateResetToken(
    token: string,
  ): Observable<ApiResponse<{ valid: boolean; email?: string }>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = { token };
    return this.http
      .post<
        ApiResponse<{ valid: boolean; email?: string }>
      >(`${this.apiUrl}/auth/validate-reset-token`, body, { headers })
      .pipe(
        tap((response) =>
          console.log('Validate Reset Token Response:', response),
        ),
        catchError(this.handleError),
      );
  }

  getUserInformation(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/user`);
  }
  updateUserInformation(model: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/user`, model);
  }

  // Basic error handler (can be expanded)
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    // Attempt to return the structured API error if available
    if (
      error.error &&
      typeof error.error === 'object' &&
      'errors' in error.error
    ) {
      return throwError(() => error.error as ApiResponseError);
    }
    // Otherwise, return a generic error structure or message
    const genericError: ApiResponseError = {
      status: error.status,
      message: error.message || 'An unknown server error occurred.',
      data: null,
      errors: [
        { field: 'general', message: error.statusText || 'Server Error' },
      ],
      metadata: null,
    };
    return throwError(() => genericError);
  }
}
