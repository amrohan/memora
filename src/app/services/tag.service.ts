import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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

  tagsData = signal<Tag[]>([]);

  searchTerm = signal<string>('');
  pageSize = signal<number>(20);
  page = signal<number>(1);
  refresh = signal(0);

  data = httpResource<ApiResponse<Tag[]>>(
    () =>
      `${
        environment.API_URL
      }/tags?search=${this.searchTerm()}&page=${this.page()}&pageSize=${this.pageSize()}`
  );

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
