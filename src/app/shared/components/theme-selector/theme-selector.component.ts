import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, Theme } from '@core/services/theme.service';
import { UserSettingsService } from '@core/services/user-settings.service';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Select Theme</span>
      </label>
      <div class="flex gap-2">
        <select 
          class="select select-bordered flex-1"
          [(ngModel)]="selectedTheme"
        >
          <option *ngFor="let theme of availableThemes" [value]="theme">
            {{ theme.charAt(0).toUpperCase() + theme.slice(1) }}
          </option>
        </select>
        <button 
          class="btn btn-primary"
          (click)="saveTheme()"
          [disabled]="isSaving || selectedTheme === currentTheme"
        >
          <span *ngIf="!isSaving">Save</span>
          <span *ngIf="isSaving" class="loading loading-spinner"></span>
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {
  selectedTheme: Theme = 'light';
  currentTheme: Theme = 'light';
  availableThemes: Theme[] = [];
  isSaving = false;
  private themeSubscription?: Subscription;

  constructor(
    private themeService: ThemeService,
    private userSettingsService: UserSettingsService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.availableThemes = [...this.themeService.availableThemes];
    this.currentTheme = this.themeService.currentThemeValue;
    this.selectedTheme = this.currentTheme;
    
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.themeChanged.subscribe((theme: Theme) => {
      this.currentTheme = theme;
      this.selectedTheme = theme;
    });
  }

  saveTheme() {
    if (this.selectedTheme === this.currentTheme || this.isSaving) {
      return;
    }

    this.isSaving = true;
    
    this.userSettingsService.saveTheme(this.selectedTheme).subscribe({
      next: () => {
        this.themeService.setTheme(this.selectedTheme, true);
        this.toastService.success('Theme saved successfully');
      },
      error: (error) => {
        console.error('Failed to save theme', error);
        this.toastService.error('Failed to save theme. Using local settings instead.');
        // Still apply the theme locally even if server save fails
        this.themeService.setTheme(this.selectedTheme, true);
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
