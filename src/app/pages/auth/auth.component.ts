import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Needed for ngModel
import { Router } from '@angular/router';
import { finalize } from 'rxjs'; // Import finalize operator
import { AuthService, LoginSuccessData } from '@services/auth.service'; // Adjust path
import { AuthStateService } from '@services/auth-state.service'; // Adjust path
import { ApiResponse, ApiResponseError, ApiError } from '@models/ApiResponse'; // Adjust path

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <!-- Header -->
          <div class="flex flex-col justify-between items-center gap-2 mb-6">
            <!-- <img src="/path/to/your/logo.svg" alt="Memora Logo" class="h-12 w-auto mb-2" /> -->
            <h1 class="text-primary text-3xl font-bold text-center">
              Welcome to Memora
            </h1>
            <p class="text-center text-base-content/80">
              Your bookmarking journey begins
            </p>
          </div>

          <!-- Tabs -->
          <div class="tabs tabs-boxed mb-6">
            <a
              class="tab tab-lg flex-1 cursor-pointer"
              [class.tab-active]="activeTab() === 'login'"
              (click)="setActiveTab('login')"
              role="tab"
            >
              Login
            </a>
            <a
              class="tab tab-lg flex-1 cursor-pointer"
              [class.tab-active]="activeTab() === 'register'"
              (click)="setActiveTab('register')"
              role="tab"
            >
              Register
            </a>
          </div>

          <!-- Login Form -->
          @if (activeTab() === 'login') {
            <form (submit)="handleLogin(); $event.preventDefault()">
              <!-- Email Input -->
              <div class="form-control">
                <label class="label" for="login-email">
                  <span class="label-text flex items-center gap-2">
                    <svg class="w-5 h-5"></svg> Email
                  </span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="email@example.com"
                  class="input input-bordered w-full"
                  [(ngModel)]="email"
                  name="login_email"
                  required
                  autocomplete="email"
                  [disabled]="isLoading()"
                />
              </div>

              <!-- Password Input -->
              <div class="form-control mt-4">
                <label class="label" for="login-password">
                  <span class="label-text flex items-center gap-2">
                    <svg class="w-5 h-5"></svg> Password
                  </span>
                </label>
                <div class="relative">
                  <input
                    id="login-password"
                    [type]="passwordVisible() ? 'text' : 'password'"
                    placeholder="Password"
                    class="input input-bordered w-full pr-10"
                    [(ngModel)]="password"
                    name="login_password"
                    required
                    autocomplete="current-password"
                    [disabled]="isLoading()"
                  />
                  <button
                    type="button"
                    class="btn btn-ghost btn-sm absolute top-0 right-0 h-full px-3"
                    (click)="togglePasswordVisibility()"
                    aria-label="Toggle password visibility"
                    [disabled]="isLoading()"
                  >
                    @if (passwordVisible()) {
                      <svg class="w-5 h-5"></svg>
                    } @else {
                      <svg class="w-5 h-5"></svg>
                    }
                  </button>
                </div>
                <label class="label">
                  <a
                    href="#"
                    class="label-text-alt link link-hover link-primary"
                  >
                    Forgot password?
                  </a>
                </label>
              </div>

              <!-- Submit Button -->
              <div class="form-control mt-6">
                <button
                  type="submit"
                  class="btn btn-primary w-full"
                  [disabled]="isLoading() || !email || !password"
                >
                  @if (isLoading()) {
                    <span class="loading loading-spinner loading-sm"></span>
                    Logging in...
                  } @else {
                    Login
                  }
                </button>
              </div>

              <!-- Login Error Message -->
              @if (authError()) {
                <div role="alert" class="alert alert-error mt-4">
                  <svg class="stroke-current shrink-0 h-6 w-6"></svg>
                  <span>{{ authError() }}</span>
                </div>
              }
            </form>
          }

          <!-- Register Form -->
          @if (activeTab() === 'register') {
            <form (submit)="handleRegister(); $event.preventDefault()">
              <h2 class="card-title mb-4 text-xl justify-center">
                Create Account
              </h2>
              <!-- Email Input -->
              <div class="form-control">
                <label class="label" for="register-email">
                  <span class="label-text flex items-center gap-2">
                    <svg class="w-5 h-5"></svg> Email
                  </span>
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="email@example.com"
                  class="input input-bordered w-full"
                  [(ngModel)]="email"
                  name="register_email"
                  required
                  autocomplete="email"
                  [disabled]="isLoading()"
                />
              </div>

              <!-- Password Input -->
              <div class="form-control mt-4">
                <label class="label" for="register-password">
                  <span class="label-text flex items-center gap-2">
                    <svg class="w-5 h-5"></svg> Password
                  </span>
                </label>
                <div class="relative">
                  <input
                    id="register-password"
                    [type]="passwordVisible() ? 'text' : 'password'"
                    placeholder="Password (min 6 chars recommended)"
                    class="input input-bordered w-full pr-10"
                    [(ngModel)]="password"
                    name="register_password"
                    required
                    autocomplete="new-password"
                    [disabled]="isLoading()"
                    minlength="6"
                  />
                  <button>...</button>
                </div>
              </div>

              <!-- Confirm Password Input -->
              <div class="form-control mt-4">
                <label class="label" for="confirm-password">
                  <span class="label-text flex items-center gap-2">
                    <svg class="w-5 h-5"></svg> Confirm Password
                  </span>
                </label>
                <input
                  id="confirm-password"
                  [type]="passwordVisible() ? 'text' : 'password'"
                  placeholder="Confirm Password"
                  class="input input-bordered w-full"
                  [class.input-error]="
                    password !== confirmPassword && !!confirmPassword
                  "
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  required
                  autocomplete="new-password"
                  [disabled]="isLoading()"
                />
              </div>

              <!-- Password Mismatch Warning -->
              @if (password !== confirmPassword && confirmPassword) {
                <div
                  role="alert"
                  class="alert alert-warning mt-4 py-2 px-3 text-sm"
                >
                  <svg class="stroke-current shrink-0 h-5 w-5"></svg>
                  <span>Passwords do not match.</span>
                </div>
              }

              <!-- Submit Button -->
              <div class="form-control mt-6">
                <button
                  type="submit"
                  class="btn btn-primary w-full"
                  [disabled]="
                    isLoading() ||
                    password !== confirmPassword ||
                    !password ||
                    !email ||
                    password.length < 6
                  "
                >
                  @if (isLoading()) {
                    <span class="loading loading-spinner loading-sm"></span>
                    Registering...
                  } @else {
                    Register
                  }
                </button>
              </div>

              <!-- Registration Error Message -->
              @if (authError()) {
                <div role="alert" class="alert alert-error mt-4">
                  <svg class="stroke-current shrink-0 h-6 w-6"></svg>
                  <span>{{ authError() }}</span>
                </div>
              }
            </form>
          }

          <!-- General Success Message -->
          @if (successMessage()) {
            <div role="alert" class="alert alert-success mt-4">
              <svg class="stroke-current shrink-0 h-6 w-6"></svg>
              <span>{{ successMessage() }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class AuthComponent implements OnInit {
  // --- Injected Services ---
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);
  private router = inject(Router);

  // --- Component State Signals ---
  activeTab = signal<'login' | 'register'>('login');
  isLoading = signal(false);
  authError = signal<string | null>(null); // Single error signal for simplicity
  successMessage = signal<string | null>(null);
  passwordVisible = signal(false);

  // --- Form Fields (using ngModel) ---
  email = '';
  password = '';
  confirmPassword = ''; // Only used in register tab

  ngOnInit(): void {
    if (this.authStateService.isAuthenticated()) {
      console.log('Already authenticated, redirecting...');
      // Redirect to a default logged-in route, e.g., dashboard
      // Use navigateByUrl to force reload if needed, or navigate for SPA navigation
      this.router.navigate(['/dashboard']); // Adjust '/dashboard' as needed
    }
  }

  // --- Methods ---
  setActiveTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.clearMessages();
    this.clearFields();
    this.passwordVisible.set(false); // Reset visibility on tab change
  }

  clearMessages(): void {
    this.authError.set(null);
    this.successMessage.set(null);
  }

  clearFields(): void {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  private formatApiErrors(errors: ApiError[] | null): string {
    if (!errors || errors.length === 0) {
      return 'An unknown error occurred.';
    }
    // Return the message of the first error, or combine them if needed
    return errors[0].message || 'Login failed.';
    // Or combine: return errors.map(e => `${e.field}: ${e.message}`).join('; ');
  }

  handleLogin(): void {
    this.clearMessages();
    if (!this.email || !this.password) {
      this.authError.set('Please enter both email and password.');
      return;
    }

    this.isLoading.set(true);

    this.authService
      .login({ email: this.email, password: this.password })
      .pipe(finalize(() => this.isLoading.set(false))) // Ensure isLoading is reset
      .subscribe({
        next: (response: ApiResponse<LoginSuccessData>) => {
          if (
            response.status === 200 &&
            response.data?.token &&
            response.data?.user
          ) {
            this.authStateService.setAuthState(
              response.data.user,
              response.data.token,
            );
            this.clearFields();
            this.router.navigate(['/dashboard']);
          } else {
            this.authError.set(
              this.formatApiErrors(response.errors) ||
              response.message ||
              'Login failed.',
            );
          }
        },
        error: (err: ApiResponseError) => {
          // Type hint based on service's catchError
          console.error('Login error:', err);
          this.authError.set(
            this.formatApiErrors(err.errors) ||
            err.message ||
            'An error occurred during login.',
          );
        },
      });
  }

  handleRegister(): void {
    this.clearMessages();

    if (!this.email || !this.password || !this.confirmPassword) {
      this.authError.set('Please fill in all fields.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.authError.set('Passwords do not match.');
      return;
    }
    if (this.password.length < 6) {
      this.authError.set('Password must be at least 6 characters long.');
      return;
    }

    this.isLoading.set(true);

    this.authService
      .register({ email: this.email, password: this.password })
      .pipe(finalize(() => this.isLoading.set(false))) // Ensure isLoading is reset
      .subscribe({
        next: (response: ApiResponse<any>) => {
          if (response.status === 200 || response.status === 201) {
            this.successMessage.set(
              response.message || 'Registration successful! Please log in.',
            );
            this.clearFields();
            this.setActiveTab('login');
          } else {
            // Handle cases where API returns 2xx but indicates failure
            this.authError.set(
              this.formatApiErrors(response.errors) ||
              response.message ||
              'Registration failed.',
            );
          }
        },
        error: (err: ApiResponseError) => {
          // Type hint based on service's catchError
          console.error('Registration error:', err);
          this.authError.set(
            this.formatApiErrors(err.errors) ||
            err.message ||
            'An error occurred during registration.',
          );
        },
      });
  }
}
