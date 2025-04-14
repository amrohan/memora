import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@models/ApiResponse';
import { Tag } from '@models/tags.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = environment.API_URL;
  private http = inject(HttpClient);

  listUserTags(): Observable<ApiResponse<Tag[]>> {
    return this.http.get<ApiResponse<Tag[]>>(`${this.apiUrl}/tags`);
  }

  createTag(tag: Tag): Observable<ApiResponse<Tag>> {
    return this.http.post<ApiResponse<Tag>>(`${this.apiUrl}/tags`, tag);
  }
  updateTag(tag: Tag): Observable<ApiResponse<Tag>> {
    return this.http.put<ApiResponse<Tag>>(
      `${this.apiUrl}/tags/${tag.id}`,
      tag
    );
  }
  deleteTag(tagId: string): Observable<ApiResponse<Tag>> {
    return this.http.delete<ApiResponse<Tag>>(`${this.apiUrl}/tags/${tagId}`);
  }
  getTagById(tagId: string): Observable<ApiResponse<Tag>> {
    return this.http.get<ApiResponse<Tag>>(`${this.apiUrl}/tags/${tagId}`);
  }
}
