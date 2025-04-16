import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { ModalComponent } from '@components/modal/modal.component';
import { DrawerComponent } from '@components/drawer/drawer.component';
import { BookmarkService } from '@services/bookmark.service';
import { map, Observable, shareReplay } from 'rxjs';
import { Bookmark } from '@models/bookmark.model';
import { ApiResponse } from '@models/ApiResponse';
import { BookmarkCardComponent } from '@components/bookmark-card/bookmark-card.component';
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PaginationComponent } from '../../components/pagination.component';

@Component({
  selector: 'app-bookmarks',
  imports: [
    HeaderComponent,
    ModalComponent,
    DrawerComponent,
    BookmarkCardComponent,
    FormsModule,
    PaginationComponent,
  ],
  template: `
    <app-header headerName="Bookmarks" />
    <section class="mb-36">
      <div class="h-20 flex justify-end items-center gap-2">
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
        <button class="btn btn-primary" (click)="openCustomModal()">Add</button>
      </div>

      <main class="grid grid-cols-1 sm:grid-cols-2  gap-4 p-4">
        @for (item of data.value()?.data; track item.id) {
        <app-bookmark-card
          [bookmark]="item"
          (handleOnEdit)="handleBookmarkEdit($event)"
          (handleOnDelete)="bookmarkDelete($event)"
        />
        }
      </main>

      <div class="flex justify-center items-center mt-4">
        @if(data.value()?.metadata ){
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

    @if(isDrawerOpen()){
    <app-drawer
      [isOpen]="isDrawerOpen()"
      [itemData]="selectedItemData()"
      (drawerClosed)="handleDrawerClosed()"
      (itemSaved)="handleItemSaved($event)"
      (itemVisit)="handleItemVisit($event)"
    >
    </app-drawer>
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

  searchTerm = signal<string>('');
  pageSize = signal<number>(20);
  page = signal<number>(1);

  data = httpResource<ApiResponse<Bookmark[]>>(
    () =>
      `${
        environment.API_URL
      }/bookmarks?search=${this.searchTerm()}&page=${this.page()}&pageSize=${this.pageSize()}`
  );

  private bookMarkService = inject(BookmarkService);

  ngOnInit(): void {}

  openCustomModal() {
    this.customModal().open();
  }

  handleConfirm() {
    const url = this.bookMarkUrl().trim();
    if (!url) {
      console.error('URL is required');
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
    console.log('Modal closed');
  }

  handleBookmarkEdit(e: Bookmark): void {
    this.selectedItemId.set(e.id);
    this.selectedItemData.set(e);
    this.toggleDrawer();
  }

  bookmarkDelete(bookmark: Bookmark) {
    this.bookMarkService.deleteBookmark(bookmark.id).subscribe({
      next: (res) => {
        if (res.status !== 200) {
          console.error('Failed to delete bookmark:', res);
          return;
        }
        this.data.update((prev: ApiResponse<Bookmark[]> | undefined) => {
          if (!prev?.data || !Array.isArray(prev.data)) {
            console.warn(
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
      error: (err) => {
        console.error(err);
      },
    });
  }

  handleDrawerClosed(): void {
    this.toggleDrawer();
  }
  handleItemSaved(data: Bookmark): void {
    this.bookMarkService.updateBookmark(data).subscribe({
      next: (res) => {
        if (res.status !== 200) {
          console.error('Failed to update bookmark:', res);
          return;
        }
        this.data.update((prev: ApiResponse<Bookmark[]> | undefined) => {
          if (!prev?.data || !Array.isArray(prev.data)) {
            console.warn(
              'Cannot update bookmark optimistically: previous data state is invalid or missing.'
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
      error: (err) => {
        console.error(err);
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
    // Assuming the service returns the created bookmark *within* an ApiResponse
    this.bookMarkService.createBookmark(b).subscribe({
      next: (res: ApiResponse<Bookmark>) => {
        const newBookmark = res.data;

        if (!newBookmark) {
          console.error('Create bookmark response did not contain data.', res);
          return;
        }

        this.data.update((prev: ApiResponse<Bookmark[]> | undefined) => {
          if (!prev?.data || !Array.isArray(prev.data)) {
            console.warn(
              'Cannot add bookmark optimistically: previous data state is invalid or missing.'
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
      error: (err) => {
        console.error('Failed to create bookmark:', err);
        // Handle error appropriately - show user feedback
      },
    });
  }
}
