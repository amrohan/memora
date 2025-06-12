import { AsyncPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiResponse } from '@models/ApiResponse';
import { Collection } from '@models/collection.model';
import { Tag } from '@models/tags.model';
import { CollectionService } from '@services/collection.service';
import { TagService } from '@services/tag.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-side-nav-bar',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  template: `
    <aside
      class="menu menu-md bg-base-200 rounded-r-md w-60 h-full fixed top-0 left-0 z-10 shadow-lg"
    >
      <ul class="pt-2 overflow-y-auto mb-10">
        <li>
          <div
            class="h-16 flex items-center justify-center border-b border-base-300"
          >
            <h1 class="text-2xl font-semibold">Memora</h1>
          </div>
        </li>
        <li>
          <a
            routerLink="/bookmarks"
            [routerLinkActive]="'bg-base-content/10 text-base-content'"
            class="font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            Bookmarks</a
          >
        </li>

        <li>
          <details open>
            <summary class="font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4 relative"
              >
                <path
                  d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
                />
              </svg>
              Collection
            </summary>
            <ul>
              <li>
                <a
                  routerLink="/collections"
                  [routerLinkActive]="'bg-base-content/10 text-base-content'"
                  class="font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  All Collections</a
                >
              </li>
              @if (collections | async) {
              <li class="menu-title text-xs px-4 pt-2">
                <span>Filter by:</span>
              </li>
              } @for ( collection of (collections | async)?.data; track
              collection.id ) {
              <li>
                <a
                  [routerLink]="['/bookmarks']"
                  [queryParams]="{
                      collectionId: collection.id,
                      collectionName: collection.name,
                    }"
                  [routerLinkActive]="'bg-base-content/10 text-base-content'"
                  >{{ collection.name }}</a
                >
              </li>
              }
            </ul>
          </details>
        </li>

        <li>
          <details open>
            <summary class="font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4 relative"
              >
                <path
                  d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
                />
                <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
              Tags
            </summary>
            <ul>
              <li>
                <a
                  routerLink="/tags"
                  [routerLinkActive]="'bg-base-content/10 text-base-content'"
                  class="font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  All Tags</a
                >
              </li>
              @if (tags | async) {
              <li class="menu-title text-xs px-4 pt-2">
                <span>Filter by:</span>
              </li>
              } @for (tag of (tags | async)?.data; track tag.id) {
              <li>
                <a
                  [routerLink]="['/bookmarks']"
                  [queryParams]="{ tagId: tag.id, tagName: tag.name }"
                  >{{ tag.name }}</a
                >
              </li>
              }
            </ul>
          </details>
        </li>
        <li>
          <a
            routerLink="/settings"
            [routerLinkActive]="'bg-base-content/10 text-base-content'"
            class="font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Settings</a
          >
        </li>
      </ul>
    </aside>
  `,
})
export class SideNavBarComponent implements OnInit {
  collectionService = inject(CollectionService);
  tagService = inject(TagService);

  collections!: Observable<ApiResponse<Collection[]>>;
  tags!: Observable<ApiResponse<Tag[]>>;

  ngOnInit() {
    this.collections = this.collectionService.getUserCollections();
    this.tags = this.tagService.listUserTags();
  }
}
