import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    <header class="h-20 flex justify-between items-center">
      <h2 class="text-base-content text-lg font-semibold">{{ headerName() }}</h2>
    </header>
  `,
  styles: ``
})
export class HeaderComponent {
  headerName = input.required<string>()
}
