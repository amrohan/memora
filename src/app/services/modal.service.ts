// modal.service.ts
import {Injectable, signal, computed, effect, type Signal} from '@angular/core';

interface ModalState {
  isOpen: boolean;
  modalId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Internal state
  private modalState = signal<ModalState>({
    isOpen: false,
    modalId: null
  });

  // Public API
  readonly isOpen = computed(() => this.modalState().isOpen);
  readonly currentModalId = computed(() => this.modalState().modalId);

  open(modalId: string): void {
    this.modalState.set({isOpen: true, modalId});
  }

  close(): void {
    this.modalState.set({isOpen: false, modalId: null});
  }

  isModalOpen(modalId: string): Signal<boolean> {
    return computed(() => this.modalState().isOpen && this.modalState().modalId === modalId);
  }
}

// <!-- Service-based Modal -->
// <button class="btn btn-accent" (click)="modalService.open('serviceModal')">Open Service Modal</button>
// <div class="modal" [class.modal-open]="modalService.isModalOpen('serviceModal')()">
// <div class="modal-box">
// <h3 class="font-bold text-lg">Service-based Modal</h3>
// <p class="py-4">This modal is controlled by the ModalService.</p>
// <div class="modal-action">
// <button class="btn" (click)="modalService.close()">Close</button>
//   </div>
//   </div>
//   <div class="modal-backdrop" (click)="modalService.close()"></div>
//   </div>
