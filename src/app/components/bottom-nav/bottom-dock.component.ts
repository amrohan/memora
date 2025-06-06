import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-dock',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div
      class="dock fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-base-300 bg-base-100 shadow-t-lg md:hidden"
    >
      <!-- Bookmarks -->
      <a
        routerLinkActive="dock-active"
        routerLink="/bookmarks"
        class="flex flex-col items-center justify-center p-2 text-center"
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
          class="size-6"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
        <span class="dock-label mt-1 text-xs">Bookmarks</span>
      </a>
      <!-- Collection -->
      <a
        routerLinkActive="dock-active"
        routerLink="/collections"
        class="flex flex-col items-center justify-center p-2 text-center"
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
          class="size-6"
        >
          <path
            d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z"
          />
          <path d="M2 8v11a2 2 0 0 0 2 2h14" />
        </svg>
        <span class="dock-label mt-1 text-xs">Collection</span>
      </a>
      <!-- Tags -->
      <a
        routerLinkActive="dock-active"
        routerLink="/tags"
        class="flex flex-col items-center justify-center p-2 text-center"
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
          class="size-6"
        >
          <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" />
          <path
            d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"
          />
          <circle cx="6.5" cy="9.5" r=".5" fill="currentColor" />
        </svg>
        <span class="dock-label mt-1 text-xs">Tags</span>
      </a>
      <!-- User/Settings -->
      <a
        routerLinkActive="dock-active"
        routerLink="/settings"
        class="flex flex-col items-center justify-center p-2 text-center"
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
          class="size-6"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span class="dock-label mt-1 text-xs">User</span>
      </a>
    </div>
  `,
})
export class BottomDockComponent { }
