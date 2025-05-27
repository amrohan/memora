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
import { ToastService } from '@services/toast.service';
import { HeaderComponent } from '../../components/header/header.component';
import { ThemeSelectorComponent } from '@components/theme-selector.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, ThemeSelectorComponent],
  template: `
    <section class="mb-26">
      <app-header headerName="Settings" />
      <!-- name of each tab group should be unique -->
      <div class="tabs tabs-border">
        <input
          type="radio"
          name="my_tabs_2"
          class="tab"
          aria-label="Profile"
          checked="checked"
        />
        <div class="tab-content bg-base-100 p-2">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-base md:text-lg">
              User Information
            </legend>
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
                @if (
                  settingsForm.get('name')?.invalid &&
                  settingsForm.get('name')?.touched
                ) {
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
                @if (
                  settingsForm.get('email')?.invalid &&
                  settingsForm.get('email')?.touched
                ) {
                  <label class="label">
                    <span class="label-text-alt text-error"
                      >Please enter a valid email address</span
                    >
                  </label>
                }
                @if (fieldErrors()?.['email']) {
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
                  }
                  Save Changes
                </button>
              </div>
            </form>
          </fieldset>
        </div>

        <!-- Themes -->
        <input type="radio" name="my_tabs_2" class="tab" aria-label="Themes" />
        <div class="tab-content bg-base-100">
          <app-theme-selector />
        </div>

        <!-- Authentication -->
        <input
          type="radio"
          name="my_tabs_2"
          class="tab"
          aria-label="Authentication"
        />
        <div class="tab-content bg-base-100 p-2">
          <!-- Change Password -->
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-base md:text-lg">
              Change Password
            </legend>
            <form [formGroup]="settingsForm" (ngSubmit)="changePassword()">
              <div class="form-control w-full mb-4">
                <label class="label">
                  <span class="label-text">Current Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  class="input input-bordered w-full"
                  formControlName="currentPassword"
                />
                @if (
                  settingsForm.get('currentPassword')?.invalid &&
                  settingsForm.get('currentPassword')?.touched
                ) {
                  <label class="label">
                    <span class="label-text-alt text-error"
                      >Please enter your current password</span
                    >
                  </label>
                }
              </div>

              <div class="form-control w-full mb-4">
                <label class="label">
                  <span class="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter a new password"
                  class="input input-bordered w-full"
                  formControlName="newPassword"
                />
                @if (
                  settingsForm.get('newPassword')?.invalid &&
                  settingsForm.get('newPassword')?.touched
                ) {
                  <label class="label">
                    <span class="label-text-alt text-error"
                      >Please enter a new password</span
                    >
                  </label>
                }
              </div>

              <div class="form-control w-full mb-6">
                <label class="label">
                  <span class="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  class="input input-bordered w-full"
                  placeholder="Confirm your new password"
                  formControlName="confirmNewPassword"
                />
                @if (
                  settingsForm.get('confirmNewPassword')?.invalid &&
                  settingsForm.get('confirmNewPassword')?.touched
                ) {
                  <label class="label">
                    <span class="label-text-alt text-error"
                      >Please confirm your new password</span
                    >
                  </label>
                }
                @if (fieldErrors()?.['confirmNewPassword']) {
                  <label class="label">
                    <span class="label-text-alt text-error">{{
                      fieldErrors()?.['confirmNewPassword']
                    }}</span>
                  </label>
                }
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="isLoading()"
                >
                  @if (isLoading()) {
                    <span class="loading loading-spinner loading-sm"></span>
                  }
                  Change Password
                </button>
              </div>
            </form>
          </fieldset>

          <div class="flex w-full flex-col">
            <div class="divider">OR</div>

            <div class="card rounded-box grid h-20 place-items-center">
              <button class="btn btn-error " (click)="authState.logout()">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public authState = inject(AuthStateService);
  public toast = inject(ToastService);

  // Signals
  isLoading = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  fieldErrors = signal<{ [key: string]: string } | null>(null);

  settingsForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    currentPassword: ['', []],
    newPassword: ['', []],
    confirmNewPassword: ['', []],
  });

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
      error: () => {
        this.toast.error('Failed to load user data. Please try again later.');
        this.errorMessage.set(
          'Failed to load user data. Please try again later.',
        );
        this.isLoading.set(false);
      },
    });
  }

  updateUserInfo() {
    if (this.settingsForm.invalid) return;

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
      next: () => {
        this.successMessage.set('Profile updated successfully...');
        this.toast.success('Profile updated successfully...');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error(
          err.error?.message || 'Failed to update profile. Please try again.',
        );
        this.errorMessage.set(err.message || 'Update failed');
      },
    });
  }

  changePassword() {
    const form = this.settingsForm;
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.fieldErrors.set(null);

    if (
      !form.value.currentPassword ||
      !form.value.newPassword ||
      !form.value.confirmNewPassword
    ) {
      this.errorMessage.set('All password fields are required.');
      return;
    }

    if (form.value.newPassword !== form.value.confirmNewPassword) {
      this.fieldErrors.set({ confirmNewPassword: 'Passwords do not match.' });
      return;
    }

    this.isLoading.set(true);

    this.authService
      .resetPassword({
        currentPassword: form.value.currentPassword,
        newPassword: form.value.newPassword,
      })
      .subscribe({
        next: () => {
          form.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          });
          this.isLoading.set(false);
          this.toast.success('Password changed successfully.');
        },
        error: (error) => {
          this.isLoading.set(false);
          if (error.error?.errors) {
            this.toast.error(
              error.error?.errors[0]?.message || 'Failed to change password.',
            );
            this.handleErrors(error.error);
          } else {
            this.toast.error(
              error.error?.message || 'Failed to change password.',
            );
            this.errorMessage.set(
              error.error?.message || 'Failed to change password.',
            );
          }
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
      this.errorMessage.set(response.message || response.errors[0].message);
    } else {
      this.errorMessage.set(response.message || 'An unknown error occurred');
    }
  }
}
