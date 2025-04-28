import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  template: `<div
    class="h-screen w-screen grid place-content-center fixed inset-0 z-50 bg-white/60"
  >
    <span class="loading loading-dots loading-xl"></span>
  </div> `,
})
export class LoadingComponent {}
