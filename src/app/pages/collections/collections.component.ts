import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CollectionCardComponent } from '@components/collection-card/collection-card.component';
import { HeaderComponent } from '@components/header/header.component';
import { ModalComponent } from '@components/modal/modal.component';
import { CollectionService } from '@services/collection.service';
import { Collection } from '@models/collection.model';
import { FormsModule } from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiResponse } from '@models/ApiResponse';
import { httpResource } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collections',
  imports: [
    HeaderComponent,
    CollectionCardComponent,
    CollectionCardComponent,
    HeaderComponent,
    ModalComponent,
    FormsModule,
  ],
  template: `
    <app-header headerName="Collection" />
    <section class="mb-36">
      <div class="h-20 flex justify-end items-center gap-2">
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
        }
        <div>
          @if (data.value()?.metadata?.hasNextPage) {
          <button class="btn btn-primary" (click)="page.set(page() + 1)">
            Load More
          </button>
          }
        </div>

        @if (data.value()?.data?.length === 0) {
        <p class="text-center">No collections found</p>
        } @if (validationError() !== null) {
        <p class="text-center text-red-500">
          {{ validationError() }}
        </p>
        } @if(data.isLoading()){
        <p>data loading</p>
        }
      </article>
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

  isEditing = signal<boolean>(false);
  setCollection = signal<Collection | null>(null);
  collections$!: Observable<ApiResponse<Collection[]>>;
  collectionName = signal<string>('');
  validationError = signal<string | null>(null);

  searchTerm = signal<string>('');
  pageSize = signal<number>(20);
  page = signal<number>(1);

  data = httpResource<ApiResponse<Collection[]>>(
    () =>
      `${
        environment.API_URL
      }/collections?search=${this.searchTerm()}&page=${this.page()}&pageSize=${this.pageSize()}`
  );

  customModal = viewChild.required<ModalComponent>('customModal');

  ngOnInit(): void {
    this.collections$ = this.collectionService
      .getUserCollections()
      .pipe(shareReplay(1));
  }

  collectionDelete(item: Collection) {
    this.collectionService.deleteCollection(item.id).subscribe({
      next: (response) => {
        this.collections$ = this.collectionService
          .getUserCollections()
          .pipe(shareReplay(1));
      },
      error: (error) => {
        console.error('Error deleting collection:', error);
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
    console.log('Opening modal');
    this.customModal().open();
  }

  handleConfirm() {
    if (this.collectionName().length < 0) {
      this.validationError.set('Please enter a valid collection name');
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
      this.validationError.set('Please enter a valid collection name');
    }
  }

  createCollection() {
    const data = this.setCollection();
    if (!data) {
      console.error('No collection data to create');
      return;
    }
    this.collectionService.createCollection(data).subscribe({
      next: (response) => {
        this.onSuccessAddOrUpdate();
      },
      error: (error) => {
        console.error('Error creating collection:', error);
      },
    });
  }
  editCollection() {
    const data = this.setCollection();
    if (!data) {
      console.error('No collection data to edit');
      return;
    }
    this.collectionService.updateCollection(data).subscribe({
      next: (response) => {
        console.log('Collection updated successfully:', response);
        this.onSuccessAddOrUpdate();
      },
      error: (error) => {
        console.error('Error updating collection:', error);
      },
    });
  }
  onSuccessAddOrUpdate() {
    this.collections$ = this.collectionService
      .getUserCollections()
      .pipe(shareReplay(1));
    this.customModal().close();
    this.collectionName.set('');
    this.isEditing.set(false);
    this.setCollection.set(null);
  }
}
