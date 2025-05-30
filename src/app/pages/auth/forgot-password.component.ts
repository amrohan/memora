import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center p-4"
    >
      <div class="w-full max-w-md bg-base-100 rounded-box shadow-2xl p-8">
        <!-- Logo/Brand -->
        <div class="flex flex-col items-center mb-8">
          <div class="flex justify-center w-full mb-4">
            <div
              class="w-16 h-16 rounded-full bg-neutral text-neutral-content flex items-center justify-center p-0 m-0"
            >
              <span
                class="text-2xl font-bold m-0 p-0 leading-none flex items-center h-full"
                >M</span
              >
            </div>
          </div>
          <h1 class="text-2xl font-bold mt-4">Forgot Password</h1>
          <p class="text-center text-base-content/80 mt-2">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <!-- Error Message -->
        @if (errorMessage) {
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
            <span>{{ errorMessage }}</span>
          </div>
        }

        <!-- Success Message -->
        @if (successMessage) {
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
            <span>{{ successMessage }}</span>
          </div>
        }

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" [class.opacity-50]="isLoading">
          <!-- Email Input -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email Address</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              class="input input-bordered w-full"
              [(ngModel)]="email"
              name="email"
              [disabled]="isLoading"
              required
              email
            />
          </div>

          <!-- Submit Button -->
          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary w-full"
              [disabled]="isLoading || !email"
            >
              @if (isLoading) {
                <span class="loading loading-spinner"></span>
                <span>Sending...</span>
              } @else {
                <span>Send Reset Link</span>
              }
            </button>
          </div>
        </form>

        <!-- Back to Login Link -->
        <div class="text-center mt-4">
          <a
            class="link link-accent hover:link-primary text-sm"
            (click)="onBackToLogin()"
            [class.pointer-events-none]="isLoading"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  onSubmit() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService
      .forgotPassword(this.email)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.successMessage =
            response.message ||
            'If an account with that email exists, you will receive a password reset link shortly.';
          this.email = '';
        },
        error: (error) => {
          this.errorMessage =
            error.message ||
            'An error occurred while processing your request. Please try again.';
        },
      });
  }

  onBackToLogin() {
    this.router.navigate(['/auth']);
  }
}
