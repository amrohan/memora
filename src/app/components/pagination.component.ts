import {Component, computed, input, model, signal} from '@angular/core';
import {ApiResponseMetadata} from '@models/ApiResponse';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [
    NgClass
  ],
  template: `
    <!--    <div class="mx-auto flex items-center justify-center h-24">-->
    <!-- RENDER TRADITIONAL PAGINATION UI -->
    @if (mode() === 'pagination' && totalPages() > 0) {
      @if (totalPages() > 1) {
        <div class="join">
          <!-- Previous Button -->
          <button
            class="join-item btn"
            aria-label="Previous Page"
            (click)="previousPage()"
            [disabled]="!hasPreviousPage()"
          >
            «
          </button>

          <!-- Page Number Buttons -->
          @for (pageNum of visiblePageNumbers(); track $index) {
            @if (typeof pageNum === 'number') {
              <button
                class="join-item btn"
                [class.btn-active]="pageNum === page()"
                (click)="goToPage(pageNum)"
              >
                {{ pageNum }}
              </button>
            } @else {
              <!-- Ellipsis Placeholder -->
              <button class="join-item btn btn-disabled pointer-events-none">
                ...
              </button>
            }
          }
          <!-- Next Button -->
          <button
            class="join-item btn"
            aria-label="Next Page"
            (click)="nextPage()"
            [disabled]="!hasNextPage()"
          >
            »
          </button>
        </div>
      } @else {
        <div class="text-sm text-base-content/70">
          All items shown on this page.
        </div>
      }
    }

    <!-- RENDER "LOAD MORE" UI -->
    @if (mode() === 'loadMore') {
      @if (hasNextPage()) {
        <button
          class="btn"
          [ngClass]="btnSize()"
          (click)="nextPage()"
          [disabled]="isLoading()"
        >
          @if (isLoading()) {
            <span class="loading loading-spinner"></span>
            Loading...
          } @else {
            Load More
          }
        </button>
      } @else if (totalCount() > 0 && showSummary()) {
        <div class="text-sm text-base-content/70">
          You've reached the end. All {{ totalCount() }} items shown.
        </div>
      }
    }
    <!--    </div>-->
  `,
})
export class PaginationComponent {
  data = input<ApiResponseMetadata | null | undefined>();
  page = model.required<number>();

  mode = input<'pagination' | 'loadMore'>('loadMore');
  btnSize = input<string>('btn-default');
  showSummary = input<boolean>(true)

  isLoading = input<boolean>(false);


  readonly MAX_VISIBLE_PAGES = 5;

  private metadata = computed(() => this.data());
  totalPages = computed(() => this.metadata()?.totalPages ?? 0);
  hasPreviousPage = computed(() => this.metadata()?.hasPreviousPage ?? false);
  hasNextPage = computed(() => this.metadata()?.hasNextPage ?? false);
  totalCount = computed(() => this.metadata()?.totalCount ?? 0);

  visiblePageNumbers = computed<('...' | number)[]>(() => {
    const currentPage = this.page();
    const total = this.totalPages();
    const maxPages = this.MAX_VISIBLE_PAGES;

    if (total <= maxPages) {
      return Array.from({length: total}, (_, i) => i + 1);
    }

    const pages: ('...' | number)[] = [];
    const sidePages = 1;
    const pagesInMiddle = maxPages - 2 * sidePages - 2;

    let startPage = Math.max(2, currentPage - Math.floor(pagesInMiddle / 2));
    let endPage = Math.min(total - 1, currentPage + Math.ceil(pagesInMiddle / 2));

    pages.push(1);

    if (startPage > 2) {
      pages.push('...');
    }

    if (currentPage < maxPages - 2) {
      endPage = maxPages - 2;
    }
    if (currentPage > total - maxPages + 3) {
      startPage = total - maxPages + 3;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  });


  goToPage(pageNum: number): void {
    if (pageNum !== this.page()) {
      this.page.set(pageNum);
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.page.update((p) => p - 1);
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.page.update((p) => p + 1);
    }
  }
}
