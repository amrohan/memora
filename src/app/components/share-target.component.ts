import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookmark } from '@models/bookmark.model';
import { BookmarkService } from '@services/bookmark.service';
import { ToastService } from '@services/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-share-target',
  imports: [],
  template: `<p>Adding bookmarks</p>`,
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
                console.log('Bookmark saved successfully via share:', response);
                this.router.navigate(['/']);
              },
              error: (error) => {
                console.error('Error saving bookmark via share:', error);
                this.toast.error('Error saving bookmark via share:', error);
                this.router.navigate(['/']);
              },
            });
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
