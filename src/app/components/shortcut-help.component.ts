import {
  Component,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-shortcut-help',
  standalone: true,
  template: `
    <button
      class="btn btn-circle"
      (click)="toggleModal()"
      aria-label="Keyboard Shortcuts"
    >
      <span class="text-lg font-bold">?</span>
    </button>

    <dialog #dialogRef class="modal" (close)="onDialogClose()">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Keyboard Shortcuts</h3>

        <ul class="space-y-3">
          <li class="flex items-center justify-between">
            <span>Focus Search</span>
            <kbd class="kbd kbd-sm">/</kbd>
          </li>
          <li class="flex items-center justify-between">
            <span>Open Add Modal</span>
            <div class="flex justify-end items-center gap-2">
              <kbd class="kbd kbd-sm">Ctrl</kbd> +
              <kbd class="kbd kbd-sm">K</kbd>
            </div>
          </li>
          <li class="flex items-center justify-between">
            <span>Save in Modal</span>
            <kbd class="kbd kbd-sm">Enter</kbd>
          </li>
          <li class="flex items-center justify-between">
            <span>Close Modal / Drawer</span>
            <kbd class="kbd kbd-sm">Escape</kbd>
          </li>
        </ul>

        <div class="modal-action mt-6">
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  `,
})
export class ShortcutHelpComponent {
  readonly showModal = signal(false);
  @ViewChild('dialogRef')
  dialog!: ElementRef<HTMLDialogElement>;


  toggleModal() {
    if (this.showModal()) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }

  openModal() {
    this.dialog.nativeElement.showModal();
    this.showModal.set(true);
  }

  closeModal() {
    this.dialog.nativeElement.close();
  }

  onDialogClose() {
    this.showModal.set(false);
  }
}
