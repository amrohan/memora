import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '@models/user';
import { ApiResponse } from '@models/ApiResponse';
import { AuthService } from '@services/auth.service';
import { AuthStateService } from '@services/auth-state.service';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  template: `
    <app-header headerName="Settings" />
    <div class="flex w-full flex-col">
      <div class="card  rounded-box grid  place-items-center">
        <section>
          <div class="card bg-base-100">
            <div class="card-body">
              @if (isLoading()) {
              <div class="flex justify-center my-4">
                <span
                  class="loading loading-spinner loading-lg text-primary"
                ></span>
              </div>
              } @if (errorMessage()) {
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
              } @if (successMessage()) {
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

              <form [formGroup]="settingsForm" (ngSubmit)="updateUserInfo()">
                <div class="form-control w-full mb-4">
                  <label class="label">
                    <span class="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    class="input input-bordered w-full"
                    formControlName="name"
                  />
                  @if (settingsForm.get('name')?.invalid &&
                  settingsForm.get('name')?.touched) {
                  <label class="label">
                    <span class="label-text-alt text-error"
                      >Please enter a valid name</span
                    >
                  </label>
                  }
                </div>

                <div class="form-control w-full mb-6">
                  <label class="label">
                    <span class="label-text">Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    class="input input-bordered w-full"
                    formControlName="email"
                  />
                  @if (settingsForm.get('email')?.invalid &&
                  settingsForm.get('email')?.touched) {
                  <label class="label">
                    <span class="label-text-alt text-error"
                      >Please enter a valid email address</span
                    >
                  </label>
                  } @if (fieldErrors()?.['email']) {
                  <label class="label">
                    <span class="label-text-alt text-error">{{
                  fieldErrors()?.['email']
                    }}</span>
                  </label>
                  }
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="settingsForm.invalid || isLoading()"
                  >
                    @if (isLoading()) {
                    <span class="loading loading-spinner loading-sm"></span>
                    } Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
      <div class="divider">OR</div>
      <div class="card  rounded-box grid h-20 place-items-center">
        <button class="btn btn-active btn-error" (click)="authState.logout()">
          Logout
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);

  // Signals
  isLoading = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  fieldErrors = signal<{ [key: string]: string } | null>(null);

  settingsForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  private authService = inject(AuthService);
  public authState = inject(AuthStateService);

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.isLoading.set(true);
    this.authService.getUserInformation().subscribe({
      next: (response) => {
        if (response.data) {
          this.settingsForm.patchValue({
            name: response.data.name || '',
            email: response.data.email || '',
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          'Failed to load user data. Please try again later.'
        );
        this.isLoading.set(false);
      },
    });
  }

  updateUserInfo() {
    if (this.settingsForm.invalid) return;

    // Reset messages
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.fieldErrors.set(null);
    this.isLoading.set(true);

    const userData: User = {
      id: '',
      name: this.settingsForm.value.name,
      email: this.settingsForm.value.email,
      createdAt: '',
      updatedAt: new Date().toDateString(),
    };
    this.authService.updateUserInformation(userData).subscribe({
      next: (res) => {
        this.successMessage.set('Profile updated successfully...');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  private handleErrors(response: ApiResponse<User>) {
    if (response.errors) {
      const fieldErrorsMap: { [key: string]: string } = {};

      response.errors.forEach((error) => {
        fieldErrorsMap[error.field] = error.message;
      });

      this.fieldErrors.set(fieldErrorsMap);

      // Set general error message from the first error
      if (response.errors.length > 0) {
        this.errorMessage.set(response.message || response.errors[0].message);
      }
    } else {
      this.errorMessage.set(response.message || 'An unknown error occurred');
    }
  }
}
