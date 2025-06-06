import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@models/ApiResponse';
import { Collection } from '@models/collection.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private apiUrl = environment.API_URL;
  private http = inject(HttpClient);

  collectionsData = signal<Collection[]>([]);
  searchTerm = signal<string>('');
  pageSize = signal<number>(20);
  page = signal<number>(1);

  public data = httpResource<ApiResponse<Collection[]>>(
    () =>
      `${environment.API_URL
      }/collections?search=${this.searchTerm()}&page=${this.page()}&pageSize=${this.pageSize()}`
  );

  getUserCollections(): Observable<ApiResponse<Collection[]>> {
    return this.http.get<ApiResponse<Collection[]>>(
      `${this.apiUrl}/collections`
    );
  }
  createCollection(
    collection: Collection
  ): Observable<ApiResponse<Collection>> {
    return this.http.post<ApiResponse<Collection>>(
      `${this.apiUrl}/collections`,
      collection
    );
  }
  updateCollection(
    collection: Collection
  ): Observable<ApiResponse<Collection>> {
    return this.http.put<ApiResponse<Collection>>(
      `${this.apiUrl}/collections/${collection.id}`,
      collection
    );
  }
  deleteCollection(collectionId: string): Observable<ApiResponse<Collection>> {
    return this.http.delete<ApiResponse<Collection>>(
      `${this.apiUrl}/collections/${collectionId}`
    );
  }
  getCollectionById(collectionId: string): Observable<ApiResponse<Collection>> {
    return this.http.get<ApiResponse<Collection>>(
      `${this.apiUrl}/collections/${collectionId}`
    );
  }
  getBookmarksByCollection(
    collectionId: string
  ): Observable<ApiResponse<Collection[]>> {
    return this.http.get<ApiResponse<Collection[]>>(
      `${this.apiUrl}/collections/${collectionId}/bookmarks`
    );
  }
}
