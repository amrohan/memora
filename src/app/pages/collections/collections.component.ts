import {Component, ElementRef, HostListener, inject, OnInit, signal, ViewChild, viewChild} from '@angular/core';
import {CollectionCardComponent} from '@components/collection-card/collection-card.component';
import {ModalComponent} from '@components/modal/modal.component';
import {CollectionService} from '@services/collection.service';
import {Collection} from '@models/collection.model';
import {FormsModule} from '@angular/forms';
import {ApiResponse} from '@models/ApiResponse';
import {httpResource} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {PaginationComponent} from '@components/pagination.component';
import {ToastService} from '@services/toast.service';
import {SearchComponent} from '@components/search.component';

@Component({
  selector: 'app-collections',
  imports: [
    CollectionCardComponent,
    CollectionCardComponent,
    ModalComponent,
    FormsModule,
    PaginationComponent,
    SearchComponent,
  ],
  template: `
    <section class="mb-36 mt-10">
      <div class="h-16 flex justify-end items-start gap-2">
        <app-search (searchChange)="searchTerm.set($event)" placeHolder="Search collection... "/>
        <button class="btn btn-primary" (click)="openCustomModal()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4 text-current"
          >
            <path
              d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
            />
          </svg>
          Add
        </button>
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
        }
      </article>

      @if (data.value()?.data?.length === 0) {
        <p class="text-center text-base-content">No collections found</p>
      }
      @if (validationError() !== null) {
        <p class="text-center text-red-500">
          {{ validationError() }}
        </p>
      }
      <!-- Skeleton -->
      @if (data.isLoading()) {
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-2 animate-fade">
          @for (item of [1, 2, 3, 4, 5, 6]; track $index) {
            <div class="skeleton h-18 w-full"></div>
          }
        </div>
      }
      <div class="flex justify-center items-center mt-4">
        @if (data.value()?.metadata) {
          <app-pagination [(page)]="page" [data]="data.value()?.metadata"/>
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
      (keydown.enter)="handleConfirm()"
      (closed)="handleClose()"
    >
      <form class="form-control ">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Collection</legend>
          <input
            #collectionInput
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
export class CollectionsComponent {
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
      }/collections?search=${this.searchTerm()}&page=${this.page()}&pageSize=${this.pageSize()}`,
  );

  customModal = viewChild.required<ModalComponent>('customModal');


  @ViewChild('collectionInput') collectionInputRef!: ElementRef<HTMLInputElement>;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.customModal().isOpen()) {
        this.customModal()?.close();
      } else {
        this.customModal()?.close();
      }
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openCustomModal();
    }
  }

  collectionDelete(item: Collection) {
    this.collectionService.deleteCollection(item.id).subscribe({
      next: () => {
        this.toast.success('Item deleted successfully...');
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
    setTimeout(() => {
      this.collectionInputRef?.nativeElement.focus();
    }, 100);
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
      isSystem: false,
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
    this.customModal().close();
    this.collectionName.set('');
    this.isEditing.set(false);
    this.setCollection.set(null);
    this.data.reload();
  }

  protected readonly console = console;
}
