import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@components/header/header.component';

interface UserSettings {
  username: string;
  email: string;
  fullName: string;
  bio: string;
  profileVisibility: 'public' | 'private';
  notifications: {
    email: boolean;
    push: boolean;
  };
  newsletter: boolean;
  theme: string;
}

@Component({
  selector: 'app-settings',
  imports: [
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  settingsForm!: FormGroup;

  // Signals
  themes = signal<string[]>(['lofi', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter']);
  selectedTheme = signal<string>('lofi');
  isSaving = signal<boolean>(false);
  saveSuccess = signal<boolean>(false);
  saveError = signal<boolean>(false);
  activeSection = signal<string>('profile');

  userData = signal<UserSettings>({
    username: '',
    email: '',
    fullName: '',
    bio: '',
    profileVisibility: 'public',
    notifications: {
      email: true,
      push: false
    },
    newsletter: false,
    theme: 'lofi'
  });

  // Computed signals
  formIsValid = computed(() => this.settingsForm?.valid || false);
  hasUnsavedChanges = computed(() => {
    if (!this.settingsForm) return false;

    const currentValues = this.settingsForm.getRawValue();
    const originalValues = this.userData();

    console.log('Current:', currentValues);
    console.log('Original:', originalValues);

    // Check specific fields instead of the entire object
    return currentValues.username !== originalValues.username ||
      currentValues.email !== originalValues.email ||
      currentValues.fullName !== originalValues.fullName ||
      // Check other fields...
      currentValues.theme !== originalValues.theme;
  });

  // Computed signal for theme
  currentTheme = computed(() => {
    const theme = this.selectedTheme();
    // Apply theme changes whenever the computed value changes
    document.documentElement.setAttribute('data-theme', theme);
    return theme;
  });


  ngOnInit() {
    this.initForm();

    // Initial theme application - this will trigger the computed signal
    this.selectedTheme.set('lofi');
    // Force the computed signal to be evaluated
    this.currentTheme();

    // Simulate fetching user data
    setTimeout(() => {
      const mockUserData: UserSettings = {
        username: 'current_user',
        email: 'user@example.com',
        fullName: 'Current User',
        bio: 'Full-stack developer focused on creating intuitive user experiences with modern web technologies.',
        profileVisibility: 'public',
        notifications: {
          email: true,
          push: false
        },
        newsletter: false,
        theme: 'lofi'
      };

      this.userData.set(mockUserData);
      this.settingsForm.patchValue(mockUserData);
      this.selectedTheme.set(mockUserData.theme);

      // Ensure theme updates when data is loaded
      this.currentTheme();
    }, 500);
  }

  initForm() {
    this.settingsForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      bio: [''],
      profileVisibility: ['public'],
      notifications: this.fb.group({
        email: [true],
        push: [false]
      }),
      newsletter: [false],
      theme: ['lofi']
    });

    // Listen to theme changes
    this.settingsForm.get('theme')?.valueChanges.subscribe(value => {
      this.selectedTheme.set(value);
      // Force evaluation of the computed signal
      this.currentTheme();
    });
  }

  saveSettings() {
    if (this.settingsForm.invalid) {
      this.markFormGroupTouched(this.settingsForm);
      return;
    }

    this.isSaving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(false);

    // Simulate API call
    setTimeout(() => {
      this.isSaving.set(false);

      // 90% chance of success for demo
      if (Math.random() > 0.1) {
        // Update the user data signal with new values
        this.userData.set(this.settingsForm.getRawValue());
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      } else {
        this.saveError.set(true);
        setTimeout(() => this.saveError.set(false), 3000);
      }
    }, 1500);

    console.log('Form values:', this.settingsForm.value);
  }

  resetForm() {
    this.settingsForm.reset(this.userData());
    this.selectedTheme.set(this.userData().theme);
    // Force evaluation of the computed signal
    this.currentTheme();
  }

  setActiveSection(section: string) {
    this.activeSection.set(section);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
