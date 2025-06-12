import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService, LoginSuccessData } from '@services/auth.service';
import { AuthStateService } from '@services/auth-state.service';
import { ApiResponse, ApiResponseError, ApiError } from '@models/ApiResponse';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, RouterLink],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center p-4"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-2 w-full max-w-5xl bg-base-100 rounded-box shadow-2xl overflow-hidden"
      >
        <!-- Illustration Side - Hidden on mobile -->
        <div
          class="hidden lg:flex flex-col justify-center items-center p-8 bg-primary/10 relative"
        >
          <div class="absolute top-0 left-0 w-full h-full opacity-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              class="w-full h-full"
            >
              <path
                fill="currentColor"
                fill-opacity="1"
                d="M0,96L34.3,112C68.6,128,137,160,206,154.7C274.3,149,343,107,411,96C480,85,549,107,617,128C685.7,149,754,171,823,165.3C891.4,160,960,128,1029,117.3C1097.1,107,1166,117,1234,144C1302.9,171,1371,213,1406,234.7L1440,256L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
              ></path>
            </svg>
          </div>

          <div class="z-10 flex flex-col items-center">
            <!-- Logo/Brand -->
            <div class="avatar avatar-placeholder">
              <div class="bg-neutral text-neutral-content w-24 rounded-full">
                <span class="text-sm">Memora</span>
              </div>
            </div>

            <h1 class="text-3xl font-bold text-center mb-4">Memora</h1>
            <p class="text-center text-base-content/80 mb-6">
              Your personal space for ideas, inspirations, and discoveries.
            </p>

            <!-- Main Illustration -->
            <!-- <img
              src="/api/placeholder/400/320"
              alt="Memora illustration"
              class="w-full max-w-sm mx-auto rounded-lg shadow-lg mb-8"
            /> -->

            <div
              class="stats stats-vertical bg-base-100 lg:stats-horizontal shadow"
            >
              <div class="stat">
                <div class="stat-title">Bookmarks</div>
                <div class="stat-value">2.6K</div>
                <div class="stat-desc">↗︎ Saved so far</div>
              </div>

              <div class="stat">
                <div class="stat-title">Users</div>
                <div class="stat-value">1.2K</div>
                <div class="stat-desc">Feb 1st - Apr 1st</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Side -->
        <div class="card bg-base-100">
          <div class="card-body p-4 sm:p-8">
            <!-- Small Logo for Mobile -->
            <div
              class="lg:hidden flex flex-col justify-between items-center gap-2 mb-6"
            >
              <div class="avatar avatar-placeholder">
                <div class="bg-neutral text-neutral-content w-24 rounded-full">
                  <span class="text-sm">Memora</span>
                </div>
              </div>
              <h1 class="text-primary text-2xl font-bold text-center mt-2">
                Welcome to Memora
              </h1>
              <p class="text-center text-base-content/80">
                Your bookmarking journey begins
              </p>
            </div>

            <!-- Header for desktop -->
            <div class="hidden lg:block">
              <h1 class="text-primary text-3xl font-bold text-center mb-1">
                Welcome Back
              </h1>
              <p class="text-center text-base-content/80 mb-6">
                @if (activeTab() === 'login') { Sign in to continue your journey
                } @else { Create an account to get started }
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      ></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Email
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Password
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      ></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    } @else {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      ></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    }
                  </button>
                </div>
                <label class="label">
                  <a
                    [routerLink]="['/forgot-password']"
                    class="label-text-alt link link-hover mt-2 hover:text-accent"
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
                  Logging in... } @else { Login }
                </button>
              </div>

              <!-- Social Login Buttons -->
              <!-- <div class="divider my-6">OR</div>

              <div class="grid grid-cols-2 gap-4">
                <button class="btn btn-outline" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="mr-2"
                  >
                    <path
                      fill="currentColor"
                      d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                    ></path>
                  </svg>
                  Google
                </button>
                <button class="btn btn-outline" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    class="mr-2"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                    ></path>
                  </svg>
                  GitHub
                </button>
              </div> -->

              <!-- Login Error Message -->
              @if (authError()) {
              <div role="alert" class="alert alert-error mt-4">
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
                <span>{{ authError() }}</span>
              </div>
              }
            </form>
            }

            <!-- Register Form -->
            @if (activeTab() === 'register') {
            <form (submit)="handleRegister(); $event.preventDefault()">
              <!-- Email Input -->
              <div class="form-control">
                <label class="label" for="register-email">
                  <span class="label-text flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      ></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Email
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Password
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
                  <button
                    type="button"
                    class="btn btn-ghost btn-sm absolute top-0 right-0 h-full px-3"
                    (click)="togglePasswordVisibility()"
                    aria-label="Toggle password visibility"
                    [disabled]="isLoading()"
                  >
                    @if (passwordVisible()) {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      ></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    } @else {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      ></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    }
                  </button>
                </div>
              </div>

              <!-- Confirm Password Input -->
              <div class="form-control mt-4">
                <label class="label" for="confirm-password">
                  <span class="label-text flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      <line x1="12" y1="16" x2="12" y2="16.01"></line>
                    </svg>
                    Confirm Password
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

              <!-- Password Strength Indicator -->
              @if (password) {
              <div class="mt-2">
                <label class="label">
                  <span class="label-text-alt">Password Strength</span>
                </label>
                <progress
                  class="progress w-full"
                  [class.progress-error]="password.length < 6"
                  [class.progress-warning]="
                    password.length >= 6 && password.length < 8
                  "
                  [class.progress-success]="password.length >= 8"
                  [value]="password.length > 10 ? 100 : password.length * 10"
                  max="100"
                ></progress>
              </div>
              }

              <!-- Password Mismatch Warning -->
              @if (password !== confirmPassword && confirmPassword) {
              <div
                role="alert"
                class="alert alert-warning mt-4 py-2 px-3 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current shrink-0 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>Passwords do not match.</span>
              </div>
              }

              <!-- Terms & Conditions Checkbox -->
              <div class="form-control mt-4">
                <label class="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-primary"
                    [(ngModel)]="termsAccepted"
                    name="termsAccepted"
                  />
                  <span class="label-text whitespace-normal break-words">
                    I agree to the
                    <a href="#" class="link link-primary">Terms of Service</a>
                    and
                    <a href="#" class="link link-primary">Privacy Policy</a>
                  </span>
                </label>
              </div>

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
                    password.length < 6 ||
                    !termsAccepted
                  "
                >
                  @if (isLoading()) {
                  <span class="loading loading-spinner loading-sm"></span>
                  Registering... } @else { Create Account }
                </button>
              </div>

              <!-- Registration Error Message -->
              @if (authError()) {
              <div role="alert" class="alert alert-error mt-4">
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
                <span>{{ authError() }}</span>
              </div>
              }
            </form>
            }

            <!-- General Success Message -->
            @if (successMessage()) {
            <div role="alert" class="alert alert-success mt-4">
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

            <!-- Footer -->
            <div class="mt-8 text-center text-sm text-base-content/70">
              <p>© 2025 Memora. All rights reserved.</p>
              <p class="mt-1">
                Need help?
                <a href="#" class="link link-primary">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthComponent implements OnInit {
  // --- Injected Services ---
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);

  private theme = inject(ThemeService);
  private router = inject(Router);

  activeTab = signal<'login' | 'register'>('login');
  isLoading = signal(false);
  authError = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  passwordVisible = signal(false);

  email = '';
  password = '';
  confirmPassword = '';
  termsAccepted = false;

  ngOnInit(): void {
    if (this.authStateService.isAuthenticated()) {
      this.router.navigate(['/bookmarks']);
    }
  }

  // --- Methods ---
  setActiveTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.clearMessages();
    this.clearFields();
    this.passwordVisible.set(false);
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
              response.data.token
            );
            this.clearFields();
            this.router.navigate(['/dashboard']);
          } else {
            this.authError.set(
              this.formatApiErrors(response.errors) ||
                response.message ||
                'Login failed.'
            );
          }
        },
        error: (err: ApiResponseError) => {
          // Type hint based on service's catchError
          console.error('Login error:', err);
          this.authError.set(
            this.formatApiErrors(err.errors) ||
              err.message ||
              'An error occurred during login.'
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
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: ApiResponse<any>) => {
          if (response.status === 200 || response.status === 201) {
            this.successMessage.set(
              response.message || 'Registration successful! Please log in.'
            );
            this.clearFields();
            this.setActiveTab('login');
          } else {
            this.authError.set(
              this.formatApiErrors(response.errors) ||
                response.message ||
                'Registration failed.'
            );
          }
        },
        error: (err: ApiResponseError) => {
          this.authError.set(
            this.formatApiErrors(err.errors) ||
              err.message ||
              'An error occurred during registration.'
          );
        },
      });
  }
}
