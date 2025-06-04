import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CollectionService } from '@services/collection.service';
import { TagService } from '@services/tag.service';

@Component({
  selector: 'app-side-nav-bar',
  imports: [RouterLink, RouterLinkActive],
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
            >Bookmarks</a
          >
        </li>

        <li>
          <details open>
            <summary class="font-medium">Collection</summary>
            <ul>
              <li>
                <a
                  routerLink="/collections"
                  [routerLinkActive]="'bg-base-content/10 text-base-content'"
                  class="font-medium"
                  >All Collections</a
                >
              </li>
              @if (collectionService.data.value()?.data?.length) {
              <li class="menu-title text-xs px-4 pt-2">
                <span>Filter by:</span>
              </li>
              } @for (collection of collectionService.data.value()?.data; track
              collection.id) {
              <li>
                <a
                  [routerLink]="['/bookmarks']"
                  [queryParams]="{
                    collectionId: collection.id,
                    collectionName: collection.name
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
            <summary class="font-medium">Tags</summary>
            <ul>
              <li>
                <a
                  routerLink="/tags"
                  [routerLinkActive]="'bg-base-content/10 text-base-content'"
                  class="font-medium"
                  >All Tags</a
                >
              </li>
              @if (tagService.data.value()?.data?.length) {
              <li class="menu-title text-xs px-4 pt-2">
                <span>Filter by:</span>
              </li>
              } @for (tag of tagService.data.value()?.data; track tag.id) {
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
            >Settings</a
          >
        </li>
      </ul>
    </aside>
  `,
})
export class SideNavBarComponent {
  collectionService = inject(CollectionService);
  tagService = inject(TagService);
}
