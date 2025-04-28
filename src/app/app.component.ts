import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <app-toast-container />
    <router-outlet />
  `,
})
export class AppComponent {
  title = 'Memora';
}
