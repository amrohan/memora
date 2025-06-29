import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {ApiResponse, ApiResponseMetadata} from '@models/ApiResponse';
import {Collection} from '@models/collection.model';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {toObservable} from '@angular/core/rxjs-interop';
// @ts-ignore
import {environment} from 'src/environments/environment';
import {combineLatest} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly apiUrl = environment.API_URL;
  private readonly http = inject(HttpClient);

  private readonly allCollections = signal<Collection[]>([]);
  private readonly paginatedCollectionsState = signal<Collection[]>([]);
  private readonly metaDataState = signal<ApiResponseMetadata | null>(null);
  private readonly isLoadingState = signal(false);

  readonly searchTerm = signal<string>('');
  readonly pageSize = signal<number>(10);
  readonly page = signal<number>(1);

  readonly sideBarStore = this.allCollections.asReadonly();
  readonly paginatedCollections = this.paginatedCollectionsState.asReadonly();
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
        this.fetchPaginatedCollections(search, page, pageSize)
      )
    ).subscribe();
  }

  private fetchPaginatedCollections(search: string, page: number, pageSize: number): Observable<ApiResponse<Collection[]>> {
    this.isLoadingState.set(true);

    if (page === 1) {
      this.paginatedCollectionsState.set([]);
    }

    const url = `${this.apiUrl}/collections?search=${search}&page=${page}&pageSize=${pageSize}`;

    return this.http.get<ApiResponse<Collection[]>>(url).pipe(
      tap({
        next: (res) => {
          const newData = res.data ?? [];
          if (newData.length > 0) {
            this.paginatedCollectionsState.update(current =>
              page > 1 ? [...current, ...newData] : newData
            );
            this.allCollections.update((currentAll) => {
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
        console.error("Failed to fetch collections:", err);
        return of();
      })
    );
  }

  private _updateStores(updateFn: (collections: Collection[]) => Collection[]) {
    this.allCollections.update(updateFn);
    this.paginatedCollectionsState.update(updateFn);
  }


  createCollection(collection: Partial<Collection>): Observable<ApiResponse<Collection>> {
    return this.http.post<ApiResponse<Collection>>(`${this.apiUrl}/collections`, collection).pipe(
      tap(res => {
        if (res.data) {
          this._updateStores(collections => [res.data!, ...collections]);
        }
      })
    );
  }

  updateCollection(collection: Collection): Observable<ApiResponse<Collection>> {
    return this.http.put<ApiResponse<Collection>>(`${this.apiUrl}/collections/${collection.id}`, collection).pipe(
      tap(res => {
        if (res.data) {
          const updatedCollection = res.data;
          this._updateStores(collections =>
            collections.map(c => c.id === updatedCollection.id ? updatedCollection : c)
          );
        }
      })
    );
  }

  deleteCollection(collectionId: string): Observable<ApiResponse<Collection>> {
    return this.http.delete<ApiResponse<Collection>>(`${this.apiUrl}/collections/${collectionId}`).pipe(
      tap(() => {
        this._updateStores(collections =>
          collections.filter(c => c.id !== collectionId)
        );
      })
    );
  }

  getCollectionById(collectionId: string): Observable<ApiResponse<Collection>> {
    return this.http.get<ApiResponse<Collection>>(`${this.apiUrl}/collections/${collectionId}`);
  }

  getBookmarksByCollection(collectionId: string): Observable<ApiResponse<Collection[]>> {
    return this.http.get<ApiResponse<Collection[]>>(`${this.apiUrl}/collections/${collectionId}/bookmarks`);
  }
}
