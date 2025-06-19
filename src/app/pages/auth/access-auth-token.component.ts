import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthStateService } from '@services/auth-state.service';
import { AuthService } from '@services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-access-token-auth',
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
          <h1 class="text-2xl font-bold mt-4">
            {{
              currentStep() === 'email'
                ? 'Access Token Login'
                : 'Verify Access Code'
            }}
          </h1>
          <p class="text-center text-base-content/80 mt-2">
            {{
              currentStep() === 'email'
                ? 'Enter your email to receive an access code'
                : 'Enter the access code sent to your email'
            }}
          </p>
        </div>

        <!-- Error Message -->
        @if (errorMessage()) {
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
            <span>{{ errorMessage() }}</span>
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

        <!-- Email Step Form -->
        @if (currentStep() === 'email') {
          <form (ngSubmit)="onGenerateCode()" [class.opacity-50]="isLoading()">
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
                [disabled]="isLoading()"
                required
                email
              />
            </div>

            <!-- Submit Button -->
            <div class="form-control mt-6">
              <button
                type="submit"
                class="btn btn-primary w-full"
                [disabled]="isLoading() || !email"
              >
                @if (isLoading()) {
                  <span class="loading loading-spinner"></span>
                  <span>Generating Code...</span>
                } @else {
                  <span>Generate Access Code</span>
                }
              </button>
            </div>
          </form>
        }

        <!-- Code Verification Step Form -->
        @if (currentStep() === 'code') {
          <form (ngSubmit)="onVerifyCode()" [class.opacity-50]="isLoading()">
            <!-- Email Display -->
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Email Address</span>
              </label>
              <div
                class="input input-bordered w-full bg-base-200 flex items-center"
              >
                <span class="text-base-content/70">{{ email }}</span>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs ml-auto"
                  (click)="onChangeEmail()"
                  [disabled]="isLoading()"
                >
                  Change
                </button>
              </div>
            </div>

            <!-- Access Code Input -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Access Code</span>
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                class="input input-bordered w-full text-center tracking-widest"
                [(ngModel)]="accessCode"
                name="accessCode"
                [disabled]="isLoading()"
                maxlength="6"
                pattern="[0-9]{6}"
                required
                (input)="onCodeInput($event)"
              />
              <label class="label">
                <span class="label-text-alt text-base-content/60 text-sm">
                  Check your email for the 6-digit code
                </span>
              </label>
            </div>

            <!-- Submit Button -->
            <div class="form-control mt-6">
              <button
                type="submit"
                class="btn btn-primary w-full"
                [disabled]="
                  isLoading() || !accessCode || accessCode.length !== 6
                "
              >
                @if (isLoading()) {
                  <span class="loading loading-spinner"></span>
                  <span>Verifying...</span>
                } @else {
                  <span>Verify & Login</span>
                }
              </button>
            </div>

            <!-- Resend Code -->
            <div class="form-control mt-4">
              <button
                type="button"
                class="btn btn-outline btn-sm w-full"
                (click)="onResendCode()"
                [disabled]="isLoading() || resendCooldown() > 0"
              >
                @if (resendCooldown() > 0) {
                  <span>Resend in {{ resendCooldown() }}s</span>
                } @else {
                  <span>Resend Code</span>
                }
              </button>
            </div>
          </form>
        }

        <!-- Back to Login Link -->
        <div class="text-center mt-6">
          <a
            class="link link-accent hover:link-primary text-sm"
            (click)="onBackToLogin()"
            [class.pointer-events-none]="isLoading()"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AccessTokenAuthComponent {
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);
  private router = inject(Router);

  email = '';
  accessCode = '';
  currentStep = signal<'email' | 'code'>('email');
  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  resendCooldown = signal(0);

  private resendTimer?: ReturnType<typeof setInterval>;

  onGenerateCode() {
    if (!this.email) {
      this.errorMessage.set('Please enter your email address');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService
      .authenticateByAccessCode(this.email)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(
            response.data?.message ||
              'Access code sent to your email successfully!',
          );
          this.currentStep.set('code');
          this.startResendCooldown();
        },
        error: (error) => {
          this.errorMessage.set(
            error.message ||
              'Failed to generate access code. Please try again.',
          );
        },
      });
  }

  onVerifyCode() {
    if (!this.accessCode || this.accessCode.length !== 6) {
      this.errorMessage.set('Please enter a valid 6-digit access code');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService
      .verifyAccessCode(this.email, this.accessCode)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set('Authentication successful! Redirecting...');
          this.authStateService.setAuthState(
            response?.data!.user,
            response?.data!.token,
          );
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage.set(
            error.message || 'Invalid access code. Please try again.',
          );
          this.accessCode = '';
        },
      });
  }

  onResendCode() {
    if (this.resendCooldown() > 0) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService
      .authenticateByAccessCode(this.email)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set('New access code sent to your email!');
          this.startResendCooldown();
          this.accessCode = '';
        },
        error: (error) => {
          this.errorMessage.set(
            error.message || 'Failed to resend access code. Please try again.',
          );
        },
      });
  }

  onChangeEmail() {
    this.currentStep.set('email');
    this.accessCode = '';
    this.clearMessages();
    this.clearResendTimer();
  }

  onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    this.accessCode = input.value;
  }

  onBackToLogin() {
    this.router.navigate(['/auth']);
  }

  private startResendCooldown() {
    this.resendCooldown.set(60);
    this.resendTimer = setInterval(() => {
      const current = this.resendCooldown();
      if (current <= 1) {
        this.clearResendTimer();
      } else {
        this.resendCooldown.set(current - 1);
      }
    }, 1000);
  }

  private clearResendTimer() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = undefined;
    }
    this.resendCooldown.set(0);
  }

  private clearMessages() {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  ngOnDestroy() {
    this.clearResendTimer();
  }
}
