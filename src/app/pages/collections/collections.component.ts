import {Component, inject, signal, viewChild} from '@angular/core';
import {CollectionCardComponent} from '@components/collection-card/collection-card.component';
import {HeaderComponent} from '@components/header/header.component';
import {ModalService} from '@services/modal.service';
import {ModalComponent} from '@components/modal/modal.component';

@Component({
  selector: 'app-collections',
  imports: [
    HeaderComponent,
    CollectionCardComponent,
    CollectionCardComponent,
    HeaderComponent,
    ModalComponent,
  ],
  template: `
    <app-header headerName="Collection"/>
    <section>


      <div class="h-20 flex justify-end items-center gap-2">
        <label class="input">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" required placeholder="Search"/>
        </label>
        <button class="btn btn-primary" (click)="openCustomModal()">Add</button>
      </div>
      <article class="grid place-content-between items-start gap-4 grid-cols-1 md:grid-cols-3">
        <app-collection-card/>
      </article>
    </section>

    <!-- Modal-->
    <app-modal
      #customModal
      [title]="!isEditing() ?'Add':'Edit'"
      [confirmText]="'Save Changes'"
      [cancelText]="'Discard'"
      [showCloseButton]="true"
      (confirmed)="handleConfirm()"
      (closed)="handleClose()">
      <div class="form-control ">
        <label class="label">
          <span class="label-text text-sm">Collection name</span>
        </label>
        <input type="text" placeholder="Enter collection name..." class="input input-bordered"/>
      </div>
    </app-modal>
  `,
})
export class CollectionsComponent {
  isEditing = signal<boolean>(false);

  customModal = viewChild.required<ModalComponent>('customModal');

  openCustomModal() {
    this.customModal().open();
  }

  handleConfirm() {
    console.log('Modal confirmed');
    // Handle form submission or other logic
  }

  handleClose() {
    console.log('Modal closed');
  }
}
