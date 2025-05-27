import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme, ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-4"
    >
      @for (theme of themes(); track theme.name) {
        <div
          class="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent"
          [class.outline-base-content!]="currentThemeSignal() === theme.name"
          (click)="selectTheme(theme.name)"
          [attr.data-set-theme]="theme.name"
          role="button"
          tabindex="0"
          [attr.aria-label]="'Select theme ' + theme.displayName"
          [attr.aria-pressed]="currentThemeSignal() === theme.name"
        >
          <div
            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
            [attr.data-theme]="theme.name"
          >
            <div class="grid grid-cols-5 grid-rows-3">
              <div class="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
              <div class="bg-base-300 col-start-1 row-start-3"></div>
              <div
                class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2"
              >
                <div class="font-bold">{{ theme.displayName }}</div>
                <div class="flex flex-wrap gap-1">
                  <div
                    class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
                  >
                    <div class="text-primary-content text-sm font-bold">A</div>
                  </div>
                  <div
                    class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6"
                  >
                    <div class="text-secondary-content text-sm font-bold">
                      A
                    </div>
                  </div>
                  <div
                    class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6"
                  >
                    <div class="text-accent-content text-sm font-bold">A</div>
                  </div>
                  <div
                    class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6"
                  >
                    <div class="text-neutral-content text-sm font-bold">A</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ThemeSelectorComponent implements OnInit {
  private themeService = inject(ThemeService);

  themes = signal<Theme[]>([]);
  currentThemeSignal = computed(() => this.themeService.currentTheme());

  ngOnInit(): void {
    this.themes.set(this.themeService.getThemes());
  }

  selectTheme(themeName: string): void {
    this.themeService.setTheme(themeName);
  }
}
