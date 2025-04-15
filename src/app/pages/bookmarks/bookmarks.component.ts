import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { ModalComponent } from '@components/modal/modal.component';
import { DrawerComponent } from '@components/drawer/drawer.component';
import { BookmarkService } from '@services/bookmark.service';
import { Observable } from 'rxjs';
import { Bookmark } from '@models/bookmark.model';
import { ApiResponse } from '@models/ApiResponse';
import { AsyncPipe } from '@angular/common';
import { BookmarkCardComponent } from '@components/bookmark-card/bookmark-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bookmarks',
  imports: [
    HeaderComponent,
    ModalComponent,
    DrawerComponent,
    AsyncPipe,
    BookmarkCardComponent,
    FormsModule,
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
      @if (bookMarks$ | async; as response) { @if (response.data &&
      response.data.length > 0) { @for (item of response.data; track item.id) {
      <app-bookmark-card
        [bookmark]="item"
        (handleOnEdit)="handleBookmarkEdit($event)"
        (handleOnDelete)="bookmarkDelete($event)"
      />
      } } @else {
      <p class="col-span-full text-center text-base-content/70 mt-8">
        No bookmarks found.
      </p>
      } } @else {
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

  bookMarks$!: Observable<ApiResponse<Bookmark[]>>;

  private bookMarkService = inject(BookmarkService);

  ngOnInit(): void {
    this.bookMarks$ = this.bookMarkService.listBookmarks();
  }

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
    console.log(bookmark);
  }

  handleDrawerClosed(): void {
    this.toggleDrawer();
  }
  handleItemSaved(data: Bookmark): void {
    this.bookMarkService.updateBookmark(data).subscribe({
      next: (res) => {
        console.log(res);
        this.bookMarks$ = this.bookMarkService.listBookmarks();
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
    this.bookMarkService.createBookmark(b).subscribe({
      next: (res) => {
        console.log(res);
        this.bookMarks$ = this.bookMarkService.listBookmarks();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
