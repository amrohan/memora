import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookmark } from '@models/bookmark.model';
import { BookmarkService } from '@services/bookmark.service';
import { ToastService } from '@services/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-share-target',
  template: `<p>Processing shared content...</p>`,
})
export class ShareTargetComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private bookmarkService = inject(BookmarkService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const url = params.get('url');
        const title = params.get('title');
        const text = params.get('text');

        const hasShareParameters = params.has('url') || params.has('title') || params.has('text');

        if (hasShareParameters) {
          if (url) {
            const newBookmark: Partial<Bookmark> = {
              url: url,
              title: title || url,
              description: text || '',
            };

            this.bookmarkService
              .createBookmark(newBookmark as Bookmark)
              .subscribe({
                next: (response) => {
                  this.toast.success('Bookmark added successfully!');
                  this.router.navigate(['/bookmarks']);
                },
                error: (error) => {
                  this.toast.error('Error saving bookmark: ' + (error.message || 'Unknown error'));
                  this.router.navigate(['/bookmarks']);
                },
              });
          } else {
            this.toast.info('To save a bookmark, please share a URL.');
            this.router.navigate(['/bookmarks']);
          }
        } else {
          this.router.navigate(['/bookmarks']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
