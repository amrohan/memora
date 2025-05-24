import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Theme } from './theme.service';

export interface UserSettings {
  theme?: Theme;
  // Add other user settings here in the future
}

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private settingsUrl = '/api/user/settings';

  constructor(private http: HttpClient) {}

  /**
   * Get user settings from the server
   */
  getUserSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.settingsUrl).pipe(
      catchError(error => {
        console.error('Error fetching user settings', error);
        return of({}); // Return empty settings if there's an error
      })
    );
  }

  /**
   * Save user settings to the server
   * @param settings The settings to save
   */
  saveUserSettings(settings: UserSettings): Observable<UserSettings> {
    return this.http.post<UserSettings>(this.settingsUrl, settings).pipe(
      tap(() => {
        // Update local storage with the new theme if it was changed
        if (settings.theme) {
          localStorage.setItem('theme', settings.theme);
        }
      }),
      catchError(error => {
        console.error('Error saving user settings', error);
        throw error; // Re-throw to allow component to handle the error
      })
    );
  }

  /**
   * Save just the theme setting
   * @param theme The theme to save
   */
  saveTheme(theme: Theme): Observable<UserSettings> {
    return this.saveUserSettings({ theme });
  }
}
