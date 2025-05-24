import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserSettingsService, UserSettings } from './user-settings.service';

export type Theme = 'light' | 'dark' | 'cupcake' | 'bumblebee' | 'emerald' | 'corporate' | 'synthwave' | 'retro' | 'cyberpunk' | 'valentine' | 'halloween' | 'garden' | 'forest' | 'aqua' | 'lofi' | 'pastel' | 'fantasy' | 'wireframe' | 'black' | 'luxury' | 'dracula' | 'cmyk' | 'autumn' | 'business' | 'acid' | 'lemonade' | 'night' | 'coffee' | 'winter';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // List of available themes from DaisyUI
  readonly availableThemes = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
  ] as const;

  // Subject to hold the current theme
  private _currentTheme: BehaviorSubject<Theme>;
  
  // Observable of the current theme
  themeChanged: Observable<Theme>;
  
  // Getter for the current theme value
  get currentThemeValue(): Theme {
    return this._currentTheme.getValue();
  }

  // Get display name of the current theme
  get currentThemeDisplayName(): string {
    const theme = this._currentTheme.getValue();
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  constructor(private userSettingsService: UserSettingsService) {
    // Initialize with a default theme
    const defaultTheme = 'light';
    
    // Initialize the BehaviorSubject with a default theme
    this._currentTheme = new BehaviorSubject<Theme>(defaultTheme);
    this.themeChanged = this._currentTheme.asObservable();
    
    // Try to load the theme from the server
    this.loadThemeFromServer();
    
    // Watch for system theme changes if no theme is saved
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  /**
   * Load theme from server or fall back to localStorage
   */
  private loadThemeFromServer() {
    this.userSettingsService.getUserSettings().pipe(
      catchError(() => of({} as UserSettings)) // Continue with empty settings if there's an error
    ).subscribe((settings: UserSettings) => {
      const localStorageTheme = localStorage.getItem('theme') as Theme | null;
      const serverTheme = settings?.theme;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Priority: server theme > local storage > system preference > default
      const theme = serverTheme || localStorageTheme || (prefersDark ? 'dark' : 'light');
      
      this._currentTheme.next(theme);
      this.applyTheme(theme);
      
      // If we have a server theme but it's not in localStorage, save it there
      if (serverTheme && serverTheme !== localStorageTheme) {
        localStorage.setItem('theme', serverTheme);
      }
    });
  }

  /**
   * Set the theme and save it to the server
   * @param theme The theme to set
   * @param skipServerSave If true, skips saving to the server (useful for initial load)
   */
  setTheme(theme: Theme, skipServerSave: boolean = false) {
    if (theme === this._currentTheme.getValue()) {
      return;
    }
    
    // Update the theme locally
    this._currentTheme.next(theme);
    this.applyTheme(theme);
    localStorage.setItem('theme', theme);
    
    // Save to server if not skipping
    if (!skipServerSave) {
      this.userSettingsService.saveTheme(theme).subscribe({
        error: (error) => {
          console.error('Failed to save theme to server', error);
          // You might want to show a toast notification here
        }
      });
    }
  }
  
  // Apply the theme to the document
  private applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Toggle between light and dark theme
  toggleTheme() {
    this.setTheme(this._currentTheme.getValue() === 'dark' ? 'light' : 'dark');
  }
}
