import {Component, input} from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="h-20 flex justify-between items-center gap-4">
      <h2 class="text-base-content text-lg font-semibold">
        {{ headerName() }}
      </h2>

      <!-- Right side actions (optional) -->
      <ng-content/>
    </header>
  `,
})
export class HeaderComponent {
  headerName = input.required<string>();
}
