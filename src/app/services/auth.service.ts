import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Auth } from '@models/auth';
import { ApiResponse, ApiResponseError } from '@models/ApiResponse';
import { AuthUser, User } from '@models/user';

export interface LoginSuccessData {
  token: string;
  user: AuthUser;
}

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
  userInfo = signal<User | null>(null);

  login(model: Auth): Observable<ApiResponse<LoginSuccessData>> {
    return this.http
      .post<ApiResponse<LoginSuccessData>>(`${this.apiUrl}/auth/login`, model)
      .pipe(
        tap((response) => console.log('Login API Response:', response)),
        catchError(this.handleError)
      );
  }

  register(model: Auth): Observable<ApiResponse<any>> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/auth/register`, model)
      .pipe(
        tap((response) => console.log('Register API Response:', response)),
        catchError(this.handleError)
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
        catchError(this.handleError)
      );
  }

  forgotPassword(email: string): Observable<ApiResponse<{ message: string }>> {
    return this.http
      .post<ApiResponse<{ message: string }>>(
        `${this.apiUrl}/auth/forgot-password`,
        { email }
      )
      .pipe(
        tap((response) => console.log('Forgot Password Response:', response)),
        catchError(this.handleError)
      );
  }

  authenticateByAccessCode(
    email: string
  ): Observable<ApiResponse<{ message: string }>> {
    return this.http
      .post<ApiResponse<{ message: string }>>(
        `${this.apiUrl}/auth/generate-access-code`,
        { email }
      )
      .pipe(
        tap((response) =>
          console.log('Generate access code Response:', response)
        ),
        catchError(this.handleError)
      );
  }

  verifyAccessCode(
    email: string,
    accessCode: string
  ): Observable<ApiResponse<LoginSuccessData>> {
    return this.http
      .post<ApiResponse<LoginSuccessData>>(
        `${this.apiUrl}/auth/verify-access-code`,
        { email, accessCode }
      )
      .pipe(
        tap((response) => console.log('Forgot Password Response:', response)),
        catchError(this.handleError)
      );
  }

  resetPasswordWithToken(
    resetData: ResetPasswordWithToken
  ): Observable<ApiResponse<{ message: string }>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<ApiResponse<{ message: string }>>(
        `${this.apiUrl}/auth/reset-password-token`,
        resetData,
        { headers }
      )
      .pipe(
        tap((response) =>
          console.log('Reset Password with Token Response:', response)
        ),
        catchError(this.handleError)
      );
  }

  validateResetToken(
    token: string
  ): Observable<ApiResponse<{ valid: boolean; email?: string }>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = { token };
    return this.http
      .post<ApiResponse<{ valid: boolean; email?: string }>>(
        `${this.apiUrl}/auth/validate-reset-token`,
        body,
        { headers }
      )
      .pipe(
        tap((response) =>
          console.log('Validate Reset Token Response:', response)
        ),
        catchError(this.handleError)
      );
  }

  getUserInformation(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/user`);
  }
  updateUserInformation(model: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/user`, model);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    if (
      error.error &&
      typeof error.error === 'object' &&
      'errors' in error.error
    ) {
      return throwError(() => error.error as ApiResponseError);
    }

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
