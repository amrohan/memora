import { Component, computed, inject, model, OnInit, signal, viewChild } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { ModalComponent } from '@components/modal/modal.component';
import { DrawerComponent } from '@components/drawer/drawer.component';
import { BookmarkService } from '@services/bookmark.service';
import { Observable } from 'rxjs';
import { Bookmark } from '@models/bookmark.model';
import { ApiResponse } from '@models/ApiResponse';
import { AsyncPipe } from '@angular/common';
import { BookmarkCardComponent } from '@components/bookmark-card/bookmark-card.component';
import { Tag } from '@models/tags.model';
import { Collection } from '@models/collection.model';

@Component({
  selector: 'app-bookmarks',
  imports: [
    HeaderComponent,
    ModalComponent,
    DrawerComponent,
    AsyncPipe,
    BookmarkCardComponent,
  ],
  template: `
    <app-header headerName="Bookmarks" />

    <section class="p-4">
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
          <input type="search" class="grow" placeholder="Search bookmarks..." />
        </label>
        <button class="btn btn-primary" (click)="openCustomModal()">Add</button>
      </div>
    </section>

    <main class="grid grid-cols-1 sm:grid-cols-2  gap-4 p-4">
      @if (bookMarks$ | async; as response) {
        @if (response.data && response.data.length > 0) {
          @for (item of response.data; track item.id) {
            <app-bookmark-card
              [bookmark]="item"
              (handleEdit)="handleBookmarkEdit($event)"
              (handleDelete)="bookmarkDelete($event)"
            />
          }
        } @else {
          <p class="col-span-full text-center text-base-content/70 mt-8">
            No bookmarks found.
          </p>
        }
      } @else {
        <!-- Optional: Loading state -->
        <p class="col-span-full text-center text-base-content/70 mt-8">
          Loading bookmarks...
        </p>
        <!-- Or use skeleton loaders -->
      }
    </main>

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
      [itemId]="selectedItemId()"
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
  // Make sure the generic type matches the expected API response structure
  bookMarks$!: Observable<ApiResponse<Bookmark[]>>;

  private bookMarkService = inject(BookmarkService);

  ngOnInit(): void {
    this.bookMarks$ = this.bookMarkService.listBookmarks();
    // Optional: Add error handling for the observable
    // this.bookMarks$.subscribe({ error: err => console.error('Failed to load bookmarks', err) });
  }

  openCustomModal() {
    this.customModal().open();
  }

  handleConfirm() {
    console.log('Modal confirmed');
    // Add logic to actually save the bookmark
  }

  handleClose() {
    this.isEditing.set(false)
    console.log('Modal closed');
  }

  // --- Keep your drawer signals and mock data ---
  selectedItemId = signal<string | null>(null);
  selectedItemData = signal<Bookmark | null>(null);

  mockCollections = signal<Collection[]>([
    /* ... */
  ]);
  mockTags = signal<Tag[]>([
    /* ... */
  ]);

  handleBookmarkEdit(e: Bookmark): void {
    this.selectedItemId.set(e.id);
    console.log(e)
    this.selectedItemData.set(e)
    this.toggleDrawer()
  }

  bookmarkDelete(id: string) {
    console.log(id);
  }

  handleDrawerClosed(): void {
    this.toggleDrawer()
  }
  handleItemSaved(data: {
    /* ... */
  }): void {
    /* ... */
  }
  handleItemVisit(id: string): void {
    /* ... */
  }

  toggleDrawer() {
    this.isDrawerOpen.set(!this.isDrawerOpen())
  }
}
