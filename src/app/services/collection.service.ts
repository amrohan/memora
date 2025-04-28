import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
