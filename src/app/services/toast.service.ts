import { Injectable, computed, signal } from '@angular/core';

export interface Toast {
  id: string;
  title?: string | null; // Title is now optional and nullable
  message: string;
  type: 'success' | 'error' | 'info' | 'warn';
  duration?: number; // milliseconds
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = computed(() => this._toasts());

  // Generic show: title can be null
  show(
    title: string | null = null,
    message: string,
    type: Toast['type'] = 'info',
    duration = 3000
  ) {
    const id = crypto.randomUUID();
    const newToast: Toast = { id, title, message, type, duration };
    this._toasts.update((ts) => [...ts, newToast]);
    setTimeout(() => this.dismiss(id), duration);
  }

  // Convenience methods
  success(message: string, title: string | null = 'Success', duration = 5000) {
    this.show(title, message, 'success', duration);
  }

  error(message: string, title: string | null = 'Error', duration = 5000) {
    this.show(title, message, 'error', duration);
  }

  info(message: string, title: string | null = 'Info', duration = 5000) {
    this.show(title, message, 'info', duration);
  }

  warn(message: string, title: string | null = 'Warning', duration = 5000) {
    this.show(title, message, 'warn', duration);
  }

  dismiss(id: string) {
    this._toasts.update((ts) => ts.filter((t) => t.id !== id));
  }

  clear() {
    this._toasts.set([]);
  }
}
