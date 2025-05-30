import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseError } from '@models/ApiResponse';
import { AuthService, ResetPasswordWithToken } from '@services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <!-- Header -->
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-base-content">Reset Password</h1>
            <p class="text-base-content/70 mt-2">
              Enter your new password below
            </p>
          </div>

          <!-- Loading State -->
          @if (isValidatingToken()) {
            <div class="flex justify-center items-center py-8">
              <span
                class="loading loading-spinner loading-lg text-primary"
              ></span>
              <span class="ml-3 text-base-content"
                >Validating reset token...</span
              >
            </div>
          }

          <!-- Invalid Token State -->
          @else if (!isTokenValid() && !isValidatingToken()) {
            <div class="text-center py-8">
              <div class="alert alert-error mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{
                  tokenError() || 'Invalid or expired reset token'
                }}</span>
              </div>
              <button
                class="btn btn-outline btn-primary"
                (click)="goToForgotPassword()"
              >
                Request New Reset Link
              </button>
            </div>
          }

          <!-- Reset Password Form -->
          @else if (isTokenValid()) {
            <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
              <!-- User Email Display -->
              @if (userEmail()) {
                <div class="alert alert-info mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span
                    >Resetting password for:
                    <strong>{{ userEmail() }}</strong></span
                  >
                </div>
              }

              <!-- New Password Field -->
              <div class="form-control mb-4">
                <label class="label">
                  <span class="label-text font-semibold">New Password</span>
                </label>
                <div class="relative">
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    class="input input-bordered w-full pr-12"
                    [class.input-error]="isFieldInvalid('newPassword')"
                    placeholder="Enter your new password"
                    formControlName="newPassword"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    (click)="togglePasswordVisibility()"
                  >
                    @if (showPassword()) {
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    } @else {
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    }
                  </button>
                </div>
                @if (isFieldInvalid('newPassword')) {
                  <label class="label">
                    <span class="label-text-alt text-error">{{
                      getFieldError('newPassword')
                    }}</span>
                  </label>
                }
              </div>

              <!-- Confirm Password Field -->
              <div class="form-control mb-6">
                <label class="label">
                  <span class="label-text font-semibold">Confirm Password</span>
                </label>
                <input
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  class="input input-bordered w-full"
                  [class.input-error]="isFieldInvalid('confirmPassword')"
                  placeholder="Confirm your new password"
                  formControlName="confirmPassword"
                />
                @if (isFieldInvalid('confirmPassword')) {
                  <label class="label">
                    <span class="label-text-alt text-error">{{
                      getFieldError('confirmPassword')
                    }}</span>
                  </label>
                }
              </div>

              <!-- Error Messages -->
              @if (apiError()) {
                <div class="alert alert-error mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{{ apiError() }}</span>
                </div>
              }

              <!-- Success Message -->
              @if (successMessage()) {
                <div class="alert alert-success mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{{ successMessage() }}</span>
                </div>
              }

              <!-- Submit Button -->
              <div class="form-control">
                <button
                  type="submit"
                  class="btn btn-primary w-full"
                  [class.loading]="isSubmitting()"
                  [disabled]="isSubmitting() || !resetForm.valid"
                >
                  @if (isSubmitting()) {
                    <span class="loading loading-spinner loading-sm"></span>
                    Resetting Password...
                  } @else {
                    Reset Password
                  }
                </button>
              </div>

              <!-- Back to Login -->
              <div class="text-center mt-4">
                <button
                  type="button"
                  class="btn btn-ghost btn-sm"
                  (click)="goToLogin()"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Signals for reactive state management
  isValidatingToken = signal(true);
  isTokenValid = signal(false);
  isSubmitting = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  apiError = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  tokenError = signal<string | null>(null);
  userEmail = signal<string | null>(null);

  private resetToken = signal<string | null>(null);

  // Reactive Form
  resetForm: FormGroup;

  // Computed properties using Angular 19 signals
  isFormValid = computed(() => this.resetForm?.valid ?? false);

  constructor() {
    this.resetForm = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  ngOnInit(): void {
    // Get token from route parameters
    this.route.params.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.resetToken.set(token);
        this.validateToken(token);
      } else {
        // Get token from query parameters as fallback
        this.route.queryParams.subscribe((queryParams) => {
          const queryToken = queryParams['token'];
          if (queryToken) {
            this.resetToken.set(queryToken);
            this.validateToken(queryToken);
          } else {
            this.isValidatingToken.set(false);
            this.tokenError.set('No reset token provided');
          }
        });
      }
    });
  }

  private validateToken(token: string): void {
    this.isValidatingToken.set(true);
    this.authService.validateResetToken(token).subscribe({
      next: (response) => {
        if (response.data?.valid) {
          this.isTokenValid.set(true);
          this.userEmail.set(response.data.email || null);
        } else {
          this.isTokenValid.set(false);
          this.tokenError.set('Invalid or expired reset token');
        }
        this.isValidatingToken.set(false);
      },
      error: (error: ApiResponseError) => {
        this.isTokenValid.set(false);
        this.tokenError.set(error.message || 'Token validation failed');
        this.isValidatingToken.set(false);
      },
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((show) => !show);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((show) => !show);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.resetForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength'])
        return `Password must be at least 8 characters`;
      if (field.errors['pattern'])
        return 'Password must contain uppercase, lowercase, number, and special character';
      if (field.errors['mismatch']) return 'Passwords do not match';
    }
    return '';
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.resetToken()) {
      this.isSubmitting.set(true);
      this.apiError.set(null);
      this.successMessage.set(null);

      const resetData: ResetPasswordWithToken = {
        token: this.resetToken()!,
        newPassword: this.resetForm.value.newPassword,
        confirmPassword: this.resetForm.value.confirmPassword,
      };

      this.authService.resetPasswordWithToken(resetData).subscribe({
        next: (response) => {
          this.successMessage.set(
            'Password reset successfully! Redirecting to login...',
          );
          this.isSubmitting.set(false);

          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: ApiResponseError) => {
          this.apiError.set(error.message || 'Failed to reset password');
          this.isSubmitting.set(false);
        },
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
