import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-shortcut-help',
  standalone: true,
  template: `
    <button
      class="btn  btn-circle"
      (click)="toggleModal()"
      aria-label="Keyboard Shortcuts"
    >
      <span class="text-lg font-bold">?</span>
    </button>

    <dialog class="modal" [open]="showModal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Keyboard Shortcuts</h3>

        <ul class="space-y-3">
          <li class="flex items-center justify-between">
            <span>Focus Search</span>
            <kbd class="kbd kbd-sm">/</kbd>
          </li>
          <li class="flex items-center justify-between">
            <span>Open Add Bookmark Modal</span>
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
            <button class="btn" (click)="closeModal()">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  `,
})
export class ShortcutHelpComponent {
  showModal = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
  }
}
