import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container.component';
import { ThemeService } from '@services/theme.service';
import { ShortcutHelpComponent } from './components/shortcut-help.component';
import { AuthStateService } from '@services/auth-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, ShortcutHelpComponent],
  template: `
    <app-toast-container />
    <router-outlet />
    @if (authStateService.isAuthenticated()) {
      <div class="absolute hidden md:block bottom-4 right-4 z-50">
        <app-shortcut-help />
      </div>
    }
  `,
})
export class AppComponent {
  title = 'Memora';

  authStateService = inject(AuthStateService);
  private theme = inject(ThemeService);
}
