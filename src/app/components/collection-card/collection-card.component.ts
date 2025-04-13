import { Component, input, output, signal } from '@angular/core';
import { Collection } from '@models/collection.model';

@Component({
  selector: 'app-collection-card',
  imports: [],
  template: `
    <div class="card card-border bg-base-100 w-full shadow-sm h-64">
      <figure class="grid place-content-center h-40 ">
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
          class="size-10 text-base-content/70"
        >
          <path
            d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
          />
        </svg>
      </figure>
      <div class="card-body">
        <div class="flex justify-between items-center gap-2">
          <div class="flex flex-col gap-1 items-start justify-center">
            <h2 class="card-title text-sm">{{ collection().name }}</h2>
            <p class="text-base-content/80">18 items</p>
          </div>
          <div class=" justify-end dropdown dropdown-end relative">
            <!-- Action Button-->
            <button class="btn btn-square btn-ghost" (click)="toggleDropdown()">
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
                class="size-5"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
            @if (isDropdownOpen()) {
            <ul
              class="dropdown menu w-40 rounded-box bg-base-100 shadow-sm absolute top-10 right-0 z-10"
            >
              <li>
                <button
                  (click)="handleEdit()"
                  class="btn btn-ghost flex justify-start items-center gap-6"
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
                      d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                    />
                    <path d="m15 5 4 4" />
                  </svg>
                  Rename
                </button>
              </li>
              <li>
                <button
                  (click)="handleDelete()"
                  class="btn btn-ghost btn-error flex justify-start items-center gap-6"
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
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  Remove
                </button>
              </li>
            </ul>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CollectionCardComponent {
  collection = input.required<Collection>();
  isDropdownOpen = signal(false);
  handleOnEdit = output<Collection>();
  handleOnDelete = output<Collection>();

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }
  handleEdit() {
    this.handleOnEdit.emit(this.collection());
    this.toggleDropdown();
  }
  handleDelete() {
    this.handleOnDelete.emit(this.collection());
    this.toggleDropdown();
  }
}
