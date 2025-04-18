import {
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tag } from '@models/tags.model';

@Component({
  selector: 'app-tags-card',
  imports: [RouterLink],
  template: `
    <div class="card bg-base-100 card-border w-full shadow-sm h-64">
      <a
        [routerLink]="['/bookmarks']"
        [queryParams]="{ tagId: tag().id, tagName: tag().name }"
      >
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
            class="size-10 text-base-content/80"
          >
            <path
              d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
            />
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
          </svg>
        </figure>
      </a>
      <div class="card-body">
        <div class="flex justify-between items-center gap-2">
          <a
            [routerLink]="['/bookmarks']"
            [queryParams]="{ tagId: tag().id, tagName: tag().name }"
          >
            <div class="flex flex-col gap-1 items-start justify-center">
              <h2 class="card-title text-sm">{{ tag().name }}</h2>
              <p class="text-base-content/80">18 items</p>
            </div>
          </a>
          <div class=" justify-end dropdown dropdown-end relative">
            <button
              #dropdownTrigger
              class="btn btn-square btn-ghost"
              (click)="toggleDropdown()"
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
                class="size-5"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
            @if (isDropdownOpen()) {
            <ul
              #dropdownMenu
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
export class TagsCardComponent {
  tag = input.required<Tag>();
  isDropdownOpen = signal(false);
  handleOnEdit = output<Tag>();
  handleOnDelete = output<Tag>();

  @ViewChild('dropdownTrigger') trigger!: ElementRef;
  @ViewChild('dropdownMenu') menu!: ElementRef;

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.isDropdownOpen()) {
      return;
    }

    const targetElement = event.target as Node;
    if (!targetElement) {
      return;
    }
    const clickedOnTrigger =
      this.trigger?.nativeElement.contains(targetElement);

    const clickedOnMenu = this.menu?.nativeElement.contains(targetElement);

    if (!clickedOnTrigger && !clickedOnMenu) {
      this.isDropdownOpen.set(false);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  handleEdit() {
    this.handleOnEdit.emit(this.tag());
    this.isDropdownOpen.set(false);
  }

  handleDelete() {
    this.handleOnDelete.emit(this.tag());
    this.isDropdownOpen.set(false);
  }
}
