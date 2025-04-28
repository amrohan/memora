import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="dock">
      <!--Dashboard-->
      <!-- <a
        routerLinkActive="dock-active"
        routerLink="/dashboard"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        <svg
          class="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
            <polyline
              points="1 11 12 2 23 11"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="2"
            ></polyline>
            <path
              d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7"
              fill="none"
              stroke="currentColor"
              stroke-linecap="square"
              stroke-miterlimit="10"
              stroke-width="2"
            ></path>
            <line
              x1="12"
              y1="22"
              x2="12"
              y2="18"
              fill="none"
              stroke="currentColor"
              stroke-linecap="square"
              stroke-miterlimit="10"
              stroke-width="2"
            ></line>
          </g>
        </svg>
        <span class="dock-label">Dashboard</span>
      </a> -->
      <!--Bookmarks-->
      <a routerLinkActive="dock-active" routerLink="/bookmarks">
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
          class="size-[1.2em]"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
        <span class="dock-label">Bookmarks</span>
      </a>
      <!--Collection-->
      <a routerLinkActive="dock-active" routerLink="/collections">
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
          class="size-[1.2em]"
        >
          <path
            d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z"
          />
          <path d="M2 8v11a2 2 0 0 0 2 2h14" />
        </svg>
        <span class="dock-label">Collection</span>
      </a>
      <!--Tags-->
      <a routerLinkActive="dock-active" routerLink="/tags">
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
          class="size-[1.2em]"
        >
          <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" />
          <path
            d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"
          />
          <circle cx="6.5" cy="9.5" r=".5" fill="currentColor" />
        </svg>
        <span class="dock-label">Tags</span>
      </a>
      <!--Settings-->
      <a routerLinkActive="dock-active" routerLink="/settings">
        <svg
          class="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
            <circle
              cx="12"
              cy="12"
              r="3"
              fill="none"
              stroke="currentColor"
              stroke-linecap="square"
              stroke-miterlimit="10"
              stroke-width="2"
            ></circle>
            <path
              d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z"
              fill="none"
              stroke="currentColor"
              stroke-linecap="square"
              stroke-miterlimit="10"
              stroke-width="2"
            ></path>
          </g>
        </svg>
        <span class="dock-label">Settings</span>
      </a>
    </div>
  `,
})
export class BottomNavComponent {}
