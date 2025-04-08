import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@models/ApiResponse';
import { Bookmark } from '@models/bookmark.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private apiUrl = environment.API_URL;
  private http = inject(HttpClient);

  listBookmarks(): Observable<ApiResponse<Bookmark[]>> {
    return this.http.get<ApiResponse<Bookmark[]>>(`${this.apiUrl}/bookmarks`);
  }
}
