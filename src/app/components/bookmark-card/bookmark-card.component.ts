import {Component} from '@angular/core';

@Component({
  selector: 'app-bookmark-card',
  imports: [],
  template: `
    <div class="card card-border bg-base-100">
      <div class="card-body">
        <div class="flex justify-between items-center gap-2 md:gap-0.5 w-full">
          <div class="avatar w-2/12 md:w-1/12">
            <div class="w-10 rounded">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"/>
            </div>
          </div>
          <div class="flex justify-between items-center gap-1 w-10/12 md:w-11/12">
            <div class="flex flex-col justify-center items-start gap-0.5">
              <p class="text-sm font-bold text-neutral-800">
                Notion
              </p>
              <p class="text-xs  text-neutral-400">
                notion.so
              </p>
            </div>
            <div class="w-10 rounded dropdown dropdown-end">
              <button class="btn btn-square btn-ghost" popovertarget="popover-1" style="anchor-name:--anchor-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="size-5">
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="19" cy="12" r="1"/>
                  <circle cx="5" cy="12" r="1"/>
                </svg>
              </button>
              <ul class="dropdown menu w-40 rounded-box bg-base-100 shadow-sm "
                  popover id="popover-1" style="position-anchor:--anchor-1">
                <li>
                  <button class="btn btn-ghost flex justify-start items-center gap-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="size-4">
                      <path
                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                    Edit
                  </button>
                </li>

                <li>
                  <button class="btn btn-ghost btn-error flex justify-start items-center gap-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="size-4">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                    Remove
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class BookmarkCardComponent {

}
