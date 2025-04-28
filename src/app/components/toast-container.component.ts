import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [NgClass],
  template: `
    @if (toasts().length > 0) {
    <div class="toast toast-top toast-center z-50">
      @for (toast of toasts(); track $index) {
      <div
        role="alert"
        class="alert w-72 flex justify-between items-center gap-2 whitespace-normal break-words"
        [ngClass]="{
            'alert-success': toast.type == 'success',
            'alert-warning': toast.type == 'warn',
            'alert-info': toast.type == 'info',
            'alert-error': toast.type == 'error',
         }"
      >
        <div class="flex flex-col items-start justify-center gap-1 ">
          <h1 class="text-sm">
            {{ toast.title }}
          </h1>
          <p class="text-xs">{{ toast.message }}</p>
        </div>
        <button (click)="dismiss(toast.id)" class="cursor-pointer">✕</button>
      </div>
      }
    </div>
    }
  `,
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }
}
