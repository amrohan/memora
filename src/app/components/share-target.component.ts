import { Component, OnInit, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookmark } from '@models/bookmark.model';
import { BookmarkService } from '@services/bookmark.service';
import { ToastService } from '@services/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type ProcessingState = 'loading' | 'success' | 'error' | 'info';

@Component({
  selector: 'app-share-target',
  standalone: true,
  template: `
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <!-- Loading State -->
          @if (state() === 'loading') {
            <div class="flex flex-col items-center gap-4">
              <span
                class="loading loading-spinner loading-lg text-primary"
              ></span>
              <h2 class="card-title text-2xl">Processing Share</h2>
              <p class="text-base-content/70">
                We're saving your shared content as a bookmark...
              </p>
            </div>
          }

          <!-- Success State -->
          @if (state() === 'success') {
            <div class="flex flex-col items-center gap-4">
              <div
                class="w-16 h-16 bg-success rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-success-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 class="card-title text-lg">Bookmark Saved!</h2>
              <p class="text-base-content/70">
                Your content has been successfully saved as a bookmark.
              </p>
            </div>
          }

          <!-- Error State -->
          @if (state() === 'error') {
            <div class="flex flex-col items-center gap-4">
              <div
                class="w-16 h-16 bg-error rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-error-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h2 class="card-title text-2xl text-error">
                Oops! Something went wrong
              </h2>
              <p class="text-base-content/70">
                {{ errorMessage() }}
              </p>
              <div class="card-actions justify-center w-full">
                <button
                  class="btn btn-primary btn-wide"
                  (click)="navigateToBookmarks()"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6l-3-2-3 2V5z"
                    ></path>
                  </svg>
                  View Bookmarks
                </button>
              </div>
            </div>
          }

          <!-- Info State -->
          @if (state() === 'info') {
            <div class="flex flex-col items-center gap-4">
              <div
                class="w-16 h-16 bg-info rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-info-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h2 class="card-title text-2xl text-info">No URL to Save</h2>
              <p class="text-base-content/70">
                To save a bookmark, please share content that contains a URL.
              </p>
              <div class="card-actions justify-center w-full">
                <button
                  class="btn btn-primary btn-wide"
                  (click)="navigateToBookmarks()"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6l-3-2-3 2V5z"
                    ></path>
                  </svg>
                  View Bookmarks
                </button>
              </div>
            </div>
          }

          @if (sharedUrl() && state() !== 'error') {
            <div class="w-full mt-6">
              <div class="divider text-xs opacity-50">SHARED CONTENT</div>
              <div class="mockup-code text-xs">
                <pre><code>{{ sharedUrl() }}</code></pre>
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Auto-redirect countdown (optional) -->
    @if (countdown() > 0 && (state() === 'success' || state() === 'info')) {
      <div class="toast toast-end">
        <div class="alert alert-info">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span class="text-sm">Redirecting in {{ countdown() }}s</span>
        </div>
      </div>
    }
  `,
})
export class ShareTargetComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private bookmarkService = inject(BookmarkService);
  private destroy$ = new Subject<void>();

  // Modern Angular 19 signals
  state = signal<ProcessingState>('loading');
  errorMessage = signal<string>('');
  sharedUrl = signal<string>('');
  countdown = signal<number>(0);

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const text = params.get('text');
        const url = params.get('url');
        const title = params.get('title');

        // Store shared URL for display
        this.sharedUrl.set(text || url || '');

        const hasShareParameters =
          params.has('url') || params.has('title') || params.has('text');

        if (hasShareParameters) {
          if (text || url) {
            const bookmarkUrl = text || url || '';
            const newBookmark: Partial<Bookmark> = {
              url: bookmarkUrl,
              title: title || undefined,
            };

            this.bookmarkService
              .createBookmark(newBookmark as Bookmark)
              .subscribe({
                next: (response) => {
                  this.state.set('success');
                  this.toast.success('Bookmark added successfully!');
                  this.navigateToBookmarks();
                },
                error: (error) => {
                  this.state.set('error');
                  this.errorMessage.set(
                    error.message ||
                      'Failed to save bookmark. Please try again.',
                  );
                  this.toast.error(
                    'Error saving bookmark: ' +
                      (error.message || 'Unknown error'),
                  );
                  this.startCountdown();
                },
              });
          } else {
            this.state.set('info');
            this.toast.info('To save a bookmark, please share a URL');
            this.startCountdown();
          }
        } else {
          this.navigateToBookmarks();
        }
      });
  }

  private startCountdown(): void {
    this.countdown.set(3);
    const timer = setInterval(() => {
      const current = this.countdown();
      if (current <= 1) {
        clearInterval(timer);
        this.navigateToBookmarks();
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  navigateToBookmarks(): void {
    this.router.navigate(['/bookmarks']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
