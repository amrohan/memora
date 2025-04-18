import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '@models/ApiResponse';
import { Bookmark } from '@models/bookmark.model';
import { CollectionService } from '@services/collection.service';
import { environment } from 'src/environments/environment';
import { BookmarkCardComponent } from '../../../components/bookmark-card/bookmark-card.component';

@Component({
  selector: 'app-collection-detail',
  imports: [BookmarkCardComponent],
  template: `
    <h1>Collection Detail</h1>
    <main class="grid grid-cols-1 sm:grid-cols-2  gap-4 p-4">
      @for (item of data.value()?.data; track item.id) {
      <app-bookmark-card [bookmark]="item" />
      }
    </main>
  `,
})
export class CollectionDetailComponent implements OnInit {
  collectionId = signal<string>('');
  searchTerm = signal<string>('');
  pageSize = signal<number>(20);
  page = signal<number>(1);

  data = httpResource<ApiResponse<Bookmark[]>>(
    () =>
      `${
        environment.API_URL
      }/collections/${this.collectionId()}/bookmarks?search=${this.searchTerm()}&page=${
        this.page
      }&pageSize=${this.pageSize()}`
  );

  private activatedRoute = inject(ActivatedRoute);
  private collectionService = inject(CollectionService);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.collectionId.set(params['collectionId']);
    });
  }

  getBookmarksByCollection(collectionId: string) {
    this.collectionService.getBookmarksByCollection(collectionId).subscribe({
      next: (response) => {
        console.log('Bookmarks:', response.data);
      },
      error: (error) => {
        console.error('Error fetching bookmarks:', error);
      },
    });
  }
}
