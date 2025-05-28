import { Component, computed, input, model } from '@angular/core';
import { ApiResponseMetadata } from '@models/ApiResponse';
@Component({
  selector: 'app-pagination',
  template: `
    @if (totalPages() > 1) {
    <div class="mx-auto flex items-center justify-center h-24">
      <div class="join">
        <!-- Previous Button -->
        <button
          class="join-item btn"
          aria-label="Previous Page"
          (click)="previousPage()"
          [disabled]="!hasPreviousPage()"
          [class.btn-disabled]="!hasPreviousPage()"
        >
          «
        </button>

        <!-- Use @for for iteration -->
        @for (pageNum of visiblePageNumbers(); track pageNum) {
        <!-- Page Number Button -->
        @if (typeof pageNum === 'number') {
        <button
          class="join-item btn"
          [class.btn-active]="pageNum === page()"
          [disabled]="pageNum === page()"
          (click)="goToPage(pageNum)"
        >
          {{ pageNum }}
        </button>
        } @else {
        <!-- Ellipsis Placeholder -->
        <button class="join-item btn btn-disabled pointer-events-none">
          ...
        </button>
        } }
        <!-- Next Button -->
        <button
          class="join-item btn"
          aria-label="Next Page"
          (click)="nextPage()"
          [disabled]="!hasNextPage()"
          [class.btn-disabled]="!hasNextPage()"
        >
          »
        </button>
      </div>
    </div>

    } @else if (totalCount() > 0) {
    <div class="flex justify-center items-center text-sm text-base-content/70 h-24">
      All items shown on this page.
    </div>
    }
  `,
})
export class PaginationComponent<T> {
  data = input<ApiResponseMetadata | null | undefined>();
  page = model.required<number>();

  readonly MAX_VISIBLE_PAGES = 4;

  metadata = computed(() => this.data());
  totalPages = computed(() => this.metadata()?.totalPages ?? 0);
  hasPreviousPage = computed(() => this.metadata()?.hasPreviousPage ?? false);
  hasNextPage = computed(() => this.metadata()?.hasNextPage ?? false);
  totalCount = computed(() => this.metadata()?.totalCount ?? 0);

  /**
   * Calculates the page numbers to display in the pagination control.
   * Includes logic for start/end ellipses if pages exceed MAX_VISIBLE_PAGES.
   */
  visiblePageNumbers = computed<('...' | number)[]>(() => {
    const currentPage = this.page();
    const total = this.totalPages();
    const maxPages = this.MAX_VISIBLE_PAGES;

    if (total <= maxPages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: ('...' | number)[] = [];
    const halfMax = Math.floor(maxPages / 2);
    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(total, currentPage + halfMax);

    if (currentPage - 1 < halfMax) {
      endPage = Math.min(total, maxPages);
    } else if (total - currentPage < halfMax) {
      startPage = Math.max(1, total - maxPages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < total) {
      if (endPage < total - 1) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  goToPage(pageNum: number | '...'): void {
    if (typeof pageNum === 'number' && pageNum !== this.page()) {
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
