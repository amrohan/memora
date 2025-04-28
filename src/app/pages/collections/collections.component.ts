import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CollectionCardComponent } from '@components/collection-card/collection-card.component';
import { HeaderComponent } from '@components/header/header.component';
import { ModalComponent } from '@components/modal/modal.component';
import { CollectionService } from '@services/collection.service';
import { Collection } from '@models/collection.model';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '@models/ApiResponse';
import { httpResource } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PaginationComponent } from '../../components/pagination.component';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-collections',
  imports: [
    HeaderComponent,
    CollectionCardComponent,
    CollectionCardComponent,
    HeaderComponent,
    ModalComponent,
    FormsModule,
    PaginationComponent,
  ],
  template: `
    <app-header headerName="Collection" />
    <section class="mb-36">
      <div class="h-16 flex justify-end items-start gap-2">
        <label class="input">
          <svg
            class="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            [(ngModel)]="searchTerm"
            name="collection"
            required
            placeholder="Search collection..."
          />
        </label>
        <button class="btn btn-primary" (click)="openCustomModal()">Add</button>
      </div>
      <article
        class="grid place-content-between items-start gap-4 grid-cols-1 md:grid-cols-3"
      >
        @for (item of data.value()?.data; track item.id) {
        <app-collection-card
          [collection]="item"
          (handleOnEdit)="handleCollectionEdit($event)"
          (handleOnDelete)="collectionDelete($event)"
        />
        } @if (data.value()?.data?.length === 0) {
        <p class="text-center">No collections found</p>
        } @if (validationError() !== null) {
        <p class="text-center text-red-500">
          {{ validationError() }}
        </p>
        } @if(data.isLoading()){
        <p>data loading</p>
        }
      </article>
      <div class="flex justify-center items-center mt-4">
        @if(data.value()?.metadata ){
        <app-pagination [(page)]="page" [data]="data.value()?.metadata" />
        }
      </div>
    </section>
    <!-- Modal-->
    <app-modal
      #customModal
      [title]="!isEditing() ? 'Add' : 'Edit'"
      [confirmText]="'Save Changes'"
      [cancelText]="'Discard'"
      [showCloseButton]="true"
      (confirmed)="handleConfirm()"
      (closed)="handleClose()"
    >
      <form class="form-control ">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Collection</legend>
          <input
            type="text"
            placeholder="Enter collection name..."
            [(ngModel)]="collectionName"
            name="collectionName"
            class="input input-bordered w-full"
          />
        </fieldset>
      </form>
    </app-modal>
  `,
})
export class CollectionsComponent implements OnInit {
  private collectionService = inject(CollectionService);
  private toast = inject(ToastService);

  isEditing = signal<boolean>(false);
  setCollection = signal<Collection | null>(null);
  collectionName = signal<string>('');
  validationError = signal<string | null>(null);

  searchTerm = signal<string>('');
  pageSize = signal<number>(10);
  page = signal<number>(1);

  data = httpResource<ApiResponse<Collection[]>>(
    () =>
      `${
        environment.API_URL
      }/collections?search=${this.searchTerm()}&page=${this.page()}&pageSize=${this.pageSize()}`
  );

  customModal = viewChild.required<ModalComponent>('customModal');

  ngOnInit(): void {}

  collectionDelete(item: Collection) {
    this.collectionService.deleteCollection(item.id).subscribe({
      next: (response) => {
        this.onSuccessAddOrUpdate();
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }

  handleCollectionEdit(item: Collection) {
    this.isEditing.set(true);
    this.setCollection.set(item as Collection);
    this.collectionName.set(item.name);
    this.openCustomModal();
  }
  openCustomModal() {
    this.customModal().open();
  }

  handleConfirm() {
    if (!this.collectionName()) {
      this.validationError.set('Please enter a valid collection name');
      this.toast.error('Please enter a valid collection name');
      return;
    }
    this.setCollection.set({
      id: this.setCollection()?.id || '',
      name: this.collectionName() || this.setCollection()?.name || '',
      description: this.setCollection()?.description || '',
      userId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (this.isEditing()) {
      this.editCollection();
    } else {
      this.createCollection();
    }
    this.customModal().close();
  }

  handleClose() {
    if (this.collectionName().length > 0) {
      this.collectionName.set('');
    }
  }

  createCollection() {
    const data = this.setCollection();
    if (!data) {
      this.toast.error('No collection data to create');
      return;
    }
    this.collectionService.createCollection(data).subscribe({
      next: (response) => {
        this.onSuccessAddOrUpdate();
        this.toast.success(response.message);
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }
  editCollection() {
    const data = this.setCollection();
    if (!data) {
      this.toast.warn('No collection data to edit');
      return;
    }
    this.collectionService.updateCollection(data).subscribe({
      next: (response) => {
        this.toast.success(response.message);
        this.onSuccessAddOrUpdate();
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }
  onSuccessAddOrUpdate() {
    this.data.reload();
    this.customModal().close();
    this.collectionName.set('');
    this.isEditing.set(false);
    this.setCollection.set(null);
  }
}
