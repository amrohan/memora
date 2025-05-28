import { Injectable, signal } from '@angular/core';

export interface Theme {
  name: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'selected-theme';
  private readonly DEFAULT_THEME = 'black';

  private themes: Theme[] = [
    { name: 'light', displayName: 'Light' },
    { name: 'dark', displayName: 'Dark' },
    { name: 'cupcake', displayName: 'Cupcake' },
    { name: 'bumblebee', displayName: 'Bumblebee' },
    { name: 'emerald', displayName: 'Emerald' },
    { name: 'corporate', displayName: 'Corporate' },
    { name: 'synthwave', displayName: 'Synthwave' },
    { name: 'retro', displayName: 'Retro' },
    { name: 'cyberpunk', displayName: 'Cyberpunk' },
    { name: 'valentine', displayName: 'Valentine' },
    { name: 'halloween', displayName: 'Halloween' },
    { name: 'garden', displayName: 'Garden' },
    { name: 'forest', displayName: 'Forest' },
    { name: 'aqua', displayName: 'Aqua' },
    { name: 'lofi', displayName: 'Lo-Fi' },
    { name: 'pastel', displayName: 'Pastel' },
    { name: 'fantasy', displayName: 'Fantasy' },
    { name: 'wireframe', displayName: 'Wireframe' },
    { name: 'black', displayName: 'Black' },
    { name: 'luxury', displayName: 'Luxury' },
    { name: 'dracula', displayName: 'Dracula' },
    { name: 'cmyk', displayName: 'CMYK' },
    { name: 'autumn', displayName: 'Autumn' },
    { name: 'business', displayName: 'Business' },
    { name: 'acid', displayName: 'Acid' },
    { name: 'lemonade', displayName: 'Lemonade' },
    { name: 'night', displayName: 'Night' },
    { name: 'coffee', displayName: 'Coffee' },
    { name: 'winter', displayName: 'Winter' },
    { name: 'dim', displayName: 'Dim' },
    { name: 'nord', displayName: 'Nord' },
    { name: 'sunset', displayName: 'Sunset' },
    { name: 'caramellatte', displayName: 'Caramel Latte' },
    { name: 'abyss', displayName: 'Abyss' },
    { name: 'silk', displayName: 'Silk' },
  ];

  public currentTheme = signal(this.getStoredTheme());

  constructor() {
    this.initializeTheme();
  }

  public getThemes(): Theme[] {
    return [...this.themes];
  }

  getCurrentTheme(): string {
    return this.getCurrentTheme();
  }

  setTheme(themeName: string): void {
    if (this.isValidTheme(themeName)) {
      localStorage.setItem(this.THEME_STORAGE_KEY, themeName);
      this.applyTheme(themeName);
      this.currentTheme.set(themeName);
    } else {
      console.warn(
        `ThemeService: Attempted to set invalid theme "${themeName}"`,
      );
      if (this.getCurrentTheme() !== this.DEFAULT_THEME) {
        this.setTheme(this.DEFAULT_THEME);
      }
    }
  }

  private getStoredTheme(): string {
    const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
    if (stored && this.isValidTheme(stored)) {
      return stored;
    }
    return this.DEFAULT_THEME;
  }

  private initializeTheme(): void {
    const themeToApply = this.getStoredTheme();
    this.applyTheme(themeToApply);
    if (this.currentTheme() !== themeToApply) {
      this.currentTheme.set(themeToApply);
    }
  }

  private applyTheme(themeName: string): void {
    document.documentElement.setAttribute('data-theme', themeName);
  }

  private isValidTheme(themeName: string): boolean {
    return this.themes.some((theme) => theme.name === themeName);
  }
}
