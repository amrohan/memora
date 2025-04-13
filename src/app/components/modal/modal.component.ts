import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal" [class.modal-open]="isOpen()">
      <div class="modal-box">
        @if (showCloseButton()) {
        <button
          (click)="close()"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        }

        <h3 class="font-bold text-lg">{{ title() }}</h3>
        <div class="py-4">
          <ng-content />
        </div>

        <div class="modal-action">
          @if (showCancelButton()) {
          <button class="btn btn-sm" (click)="close()">
            {{ cancelText() }}
          </button>
          } @if (showConfirmButton()) {
          <button class="btn btn-primary btn-sm" (click)="confirm()">
            {{ confirmText() }}
          </button>
          }
        </div>
      </div>

      @if (closeOnBackdropClick()) {
      <div class="modal-backdrop" (click)="close()"></div>
      }
    </div>
  `,
})
export class ModalComponent {
  // Input signals
  title = input<string>('Modal Title');
  confirmText = input<string>('OK');
  cancelText = input<string>('Cancel');
  showCloseButton = input<boolean>(true);
  showConfirmButton = input<boolean>(true);
  showCancelButton = input<boolean>(true);
  closeOnBackdropClick = input<boolean>(true);

  // Internal state
  public isOpen = signal<boolean>(false);

  // Output events
  confirmed = output<void>();
  closed = output<void>();

  // Methods
  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  confirm(): void {
    this.confirmed.emit();
    this.close();
  }

  // Cleanup when component is destroyed
  ngOnDestroy() {
    this.isOpen.set(false);
  }
}
