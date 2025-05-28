import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ModalComponent } from '@components/modal/modal.component';
import { DrawerComponent } from '@components/drawer/drawer.component';
import { BookmarkService } from '@services/bookmark.service';
import { Bookmark } from '@models/bookmark.model';
import { ApiResponse } from '@models/ApiResponse';
import { BookmarkCardComponent } from '@components/bookmark-card/bookmark-card.component';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PaginationComponent } from '../../components/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../../components/loading.component';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-bookmarks',
  imports: [
    ModalComponent,
    DrawerComponent,
    BookmarkCardComponent,
    FormsModule,
    PaginationComponent,
    LoadingComponent,
  ],
  template: `
    <section class="mb-36 mt-10">
      <div class="h-16 flex justify-end items-start gap-2">
        <label class="input input-bordered flex items-center gap-2">
          <svg
            class="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            type="search"
            class="grow"
            placeholder="Search bookmarks..."
            [(ngModel)]="searchTerm"
          />
        </label>
        <button class="btn btn-primary" (click)="openCustomModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 text-current"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="15" x2="9" y1="10" y2="10"/></svg>
          Add
        </button>
      </div>

      <!-- Filter -->
      @if (collectionName() || tagName()) {
      <div class="h-12 flex justify-start items-center gap-2">
       <p class="text-base-content text-sm">Filters:</p>
        <button
          class="btn btn-active btn-primary btn-xs"
          (click)="clearQueryParams()"
        >
          {{ collectionName() ? collectionName() : tagName() }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3.5"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      }

      <main class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        @for (item of data.value()?.data; track item.id) {
        <app-bookmark-card
          [bookmark]="item"
          (handleOnEdit)="handleBookmarkEdit($event)"
          (handleOnDelete)="bookmarkDelete($event)"
        />
        }
      </main>

        @if (data.value()?.data?.length === 0) {
        <div
          class="col-span-1 sm:col-span-2 h-96 flex justify-center items-center"
        >
          <p class="text-center text-gray-500 text-sm">
            No recods found. Please add a bookmark.
          </p>
        </div>
        }

      <!--Loading -->
      @if (data.isLoading()) {
      <div
        class="w-full grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-4 animate-fade"
      >
        @for (item of [1, 2, 3, 4, 5, 6, 7, 8, 9]; track $index) {
        <div class="flex w-full flex-col gap-2">
          <div class="skeleton h-10 w-full"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class=" flex justify-between items-center mt-6">
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-28"></div>
          </div>
        </div>
        }
      </div>
      }
      <div class="flex justify-center items-center mt-4">
        @if (data.value()?.metadata) {
        <app-pagination [(page)]="page" [data]="data.value()?.metadata" />
        }
      </div>
    </section>
    <!-- Modal-->
    <app-modal
      #customModal
      [title]="!isEditing() ? 'Add Bookmark' : 'Edit Bookmark'"
      [confirmText]="'Save Changes'"
      [cancelText]="'Discard'"
      [showCloseButton]="true"
      (confirmed)="handleConfirm()"
      (closed)="handleClose()"
    >
      <!-- Modal content -->
      <div class="form-control">
        <legend class="fieldset-legend text-sm text-base-content mb-1">
          URL *
        </legend>
        <label class="input input-bordered flex items-center gap-2 w-full">
          <svg
            class="h-[1em] opacity-50 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
            ></path>
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
            ></path>
          </svg>
          <input
            type="url"
            class="grow"
            name="url"
            [(ngModel)]="bookMarkUrl"
            required
            placeholder="https://example.com"
            value=""
            pattern="https?://.+"
            title="Must be a valid URL starting with http:// or https://"
          />
        </label>
      </div>
    </app-modal>

    @if (isDrawerOpen()) {
    <app-drawer
      [isOpen]="isDrawerOpen()"
      [itemData]="selectedItemData()"
      (drawerClosed)="handleDrawerClosed()"
      (itemSaved)="handleItemSaved($event)"
      (itemVisit)="handleItemVisit($event)"
    />
    }

    <!-- Loading screen      -->
    @if (isAddingBookmark()) {
    <app-loading />
    }
  `,
})
export class BookmarksComponent implements OnInit {
  isEditing = signal<boolean>(false);
  isDrawerOpen = signal(false);
  customModal = viewChild.required<ModalComponent>('customModal');
  bookMarkUrl = signal<string>('');
  selectedItemId = signal<string | null>(null);
  selectedItemData = signal<Bookmark | null>(null);
  isAddingBookmark = signal(false);

  searchTerm = signal<string>('');
  pageSize = signal<number>(20);
  page = signal<number>(1);
  collectionId = signal<string>('');
  tagId = signal<string>('');
  collectionName = signal<string>('');
  tagName = signal<string>('');

  data = httpResource<ApiResponse<Bookmark[]>>(
    () =>
      `${environment.API_URL
      }/bookmarks?collectionId=${this.collectionId()}&tagId=${this.tagId()}&search=${this.searchTerm()}&page=${this.page()}&pageSize=${this.pageSize()}`
  );

  private bookMarkService = inject(BookmarkService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.collectionName.set(params['collectionName']);
      this.tagName.set(params['tagName']);
      this.collectionId.set(params['collectionId']);
      this.tagId.set(params['tagId']);
    });
  }

  openCustomModal() {
    this.customModal().open();
  }

  handleConfirm() {
    const url = this.bookMarkUrl().trim();
    if (!url) {
      this.toast.error('URL is required');
      return;
    }
    // partial just get url and pass to createbookmark
    const bookmark: Partial<Bookmark> = {
      url,
    };
    this.createBookMark(bookmark as Bookmark);
    this.bookMarkUrl.set('');
    this.customModal().close();
    this.isEditing.set(false);
  }

  handleClose() {
    this.isEditing.set(false);
  }

  handleBookmarkEdit(e: Bookmark): void {
    this.selectedItemId.set(e.id);
    this.selectedItemData.set(e);
    this.toggleDrawer();
  }

  bookmarkDelete(bookmark: Bookmark) {
    this.bookMarkService.deleteBookmark(bookmark.id).subscribe({
      next: (res) => {
        this.data.update((prev: ApiResponse<Bookmark[]> | undefined) => {
          if (!prev?.data || !Array.isArray(prev.data)) {
            this.toast.warn(
              'Cannot remove bookmark optimistically: previous data state is invalid or missing.'
            );
            return prev;
          }

          const updatedDataArray = prev.data.filter(
            (item) => item.id !== bookmark.id
          );
          return {
            ...prev,
            data: updatedDataArray,
            metadata: prev.metadata
              ? { ...prev.metadata, totalCount: prev.metadata.totalCount - 1 }
              : null,
          };
        });
        this.selectedItemId.set(null);
        this.selectedItemData.set(null);
        this.isDrawerOpen.set(false);
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }

  handleDrawerClosed(): void {
    this.toggleDrawer();
  }
  handleItemSaved(data: Bookmark): void {
    this.bookMarkService.updateBookmark(data).subscribe({
      next: (res) => {
        this.data.update((prev: ApiResponse<Bookmark[]> | undefined) => {
          if (!prev?.data || !Array.isArray(prev.data)) {
            this.toast.warn(
              'Cannot remove bookmark optimistically: previous data state is invalid or missing.'
            );
            return prev;
          }

          const updatedDataArray = prev.data.map((item) =>
            item.id === data.id ? { ...item, ...data } : item
          );
          return {
            ...prev,
            data: updatedDataArray,
          };
        });
        this.selectedItemId.set(null);
        this.selectedItemData.set(null);
        this.isDrawerOpen.set(false);
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }
  handleItemVisit(id: string): void {
    /* ... */
  }

  toggleDrawer() {
    this.isDrawerOpen.set(!this.isDrawerOpen());
  }

  createBookMark(b: Bookmark) {
    this.isAddingBookmark.set(true);

    this.bookMarkService.createBookmark(b).subscribe({
      next: (res: ApiResponse<Bookmark>) => {
        const newBookmark = res.data;
        this.isAddingBookmark.set(false);
        if (!newBookmark) {
          this.toast.error('Create bookmark response did not contain data.');
          return;
        }

        this.data.update((prev: ApiResponse<Bookmark[]> | undefined) => {
          if (!prev?.data || !Array.isArray(prev.data)) {
            this.toast.warn(
              'Cannot remove bookmark optimistically: previous data state is invalid or missing.'
            );
            return prev;
          }

          const updatedDataArray: Bookmark[] = [newBookmark, ...prev.data];
          this.handleBookmarkEdit(newBookmark);
          return {
            ...prev,
            data: updatedDataArray, // Override the data property
            // Optional: You might want to update metadata like totalCount if applicable
            metadata: prev.metadata
              ? { ...prev.metadata, totalCount: prev.metadata.totalCount + 1 }
              : null,
          };
        });
      },
      error: (error) => {
        this.toast.error(error.error.message);
        this.isAddingBookmark.set(false);
      },
    });
  }

  clearQueryParams() {
    this.router.navigate([], {
      queryParams: {
        collectionId: null,
        tagId: null,
        tagName: null,
        collectionName: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
