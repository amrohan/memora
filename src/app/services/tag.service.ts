import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ApiResponse, ApiResponseMetadata} from '@models/ApiResponse';
import {Tag} from '@models/tags.model';
// @ts-ignore
import {environment} from 'src/environments/environment';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly apiUrl = environment.API_URL;
  private readonly http = inject(HttpClient);

  private readonly allTags = signal<Tag[]>([]);
  private readonly paginatedTagsState = signal<Tag[]>([]);
  private readonly metaDataState = signal<ApiResponseMetadata | null>(null);
  private readonly isLoadingState = signal(false);

  readonly searchTerm = signal<string>('');
  readonly pageSize = signal<number>(10);
  readonly page = signal<number>(1);

  readonly tags = this.allTags.asReadonly();
  readonly paginatedTags = this.paginatedTagsState.asReadonly();
  readonly metaData = this.metaDataState.asReadonly();
  readonly isLoading = this.isLoadingState.asReadonly();
  readonly hasMore = computed(() => this.metaData()?.hasNextPage ?? false);

  constructor() {
    const debouncedSearchTerm$ = toObservable(this.searchTerm).pipe(
      debounceTime(300),
      tap(() => this.page.set(1)),
      distinctUntilChanged()
    );

    const page$ = toObservable(this.page);
    const pageSize$ = toObservable(this.pageSize);

    const params$ = combineLatest({
      search: debouncedSearchTerm$,
      page: page$,
      pageSize: pageSize$,
    });

    params$.pipe(
      switchMap(({search, page, pageSize}) =>
        this.fetchPaginatedTags(search, page, pageSize)
      )
    ).subscribe();
  }

  private fetchPaginatedTags(search: string, page: number, pageSize: number): Observable<ApiResponse<Tag[]>> {
    this.isLoadingState.set(true);

    if (page === 1) {
      this.paginatedTagsState.set([]);
    }

    const url = `${this.apiUrl}/tags?search=${search}&page=${page}&pageSize=${pageSize}`;

    return this.http.get<ApiResponse<Tag[]>>(url).pipe(
      tap({
        next: (res) => {
          const newData = res.data ?? [];
          if (newData.length > 0) {
            this.paginatedTagsState.update(current =>
              page > 1 ? [...current, ...newData] : newData
            );
            this.allTags.update((currentAll) => {
              const combined = [...currentAll, ...newData];
              return Array.from(new Map(combined.map(item => [item.id, item])).values());
            });
          }
          this.metaDataState.set(res.metadata);
          this.isLoadingState.set(false);
        },
        error: () => {
          this.isLoadingState.set(false);
        }
      }),
      catchError((err) => {
        console.error("Failed to fetch tags:", err);
        return of();
      })
    );
  }

  private _updateStores(updateFn: (tags: Tag[]) => Tag[]) {
    this.allTags.update(updateFn);
    this.paginatedTagsState.update(updateFn);
  }


  createTag(tag: Partial<Tag>): Observable<ApiResponse<Tag>> {
    return this.http.post<ApiResponse<Tag>>(`${this.apiUrl}/tags`, tag).pipe(
      tap(res => {
        if (res.data) {
          this._updateStores(tags => [res.data!, ...tags]);
        }
      })
    );
  }

  updateTag(tag: Tag): Observable<ApiResponse<Tag>> {
    return this.http.put<ApiResponse<Tag>>(`${this.apiUrl}/tags/${tag.id}`, tag).pipe(
      tap(res => {
        if (res.data) {
          const updatedTag = res.data;
          this._updateStores(tags =>
            tags.map(t => (t.id === updatedTag.id ? updatedTag : t))
          );
        }
      })
    );
  }

  deleteTag(tagId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/tags/${tagId}`).pipe(
      tap(() => {
        this._updateStores(tags => tags.filter(t => t.id !== tagId));
      })
    );
  }

  getTagById(tagId: string): Observable<ApiResponse<Tag>> {
    return this.http.get<ApiResponse<Tag>>(`${this.apiUrl}/tags/${tagId}`);
  }
}
