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
    <div
      class="card bg-base-100 w-full  hover:shadow-lg transition-all duration-300 border border-base-200 rounded-lg animate-fade"
    >
      <div class="card-body p-3 flex flex-row items-center">
        <!-- Icon on left -->
        <a
          [routerLink]="['/bookmarks']"
          [queryParams]="{ tagId: tag().id, tagName: tag().name }"
          class="flex-shrink-0 mr-3"
        >
          <div class="relative w-10 h-10 flex items-center justify-center">
            <div
              class="absolute inset-0 bg-accent/10 rounded-full blur-md opacity-70"
            ></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-6 relative"
            >
              <path
                d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
              />
              <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
          </div>
        </a>

        <!-- Tag name and info in middle -->
        <a
          [routerLink]="['/bookmarks']"
          [queryParams]="{ tagId: tag().id, tagName: tag().name }"
          class="flex-grow hover:opacity-80 transition-opacity duration-200"
        >
          <div class="flex flex-col">
            <h2 class="font-medium text-sm md:text-base">{{ tag().name }}</h2>
            <!-- <div class="flex items-center gap-1 text-base-content/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              <span class="text-xs">18 items</span>
            </div> -->
          </div>
        </a>

        <!-- Action button on right -->
        <div class="dropdown dropdown-end flex-shrink-0">
          <button
            #dropdownTrigger
            class="btn btn-sm btn-ghost btn-circle"
            (click)="toggleDropdown()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
          @if (isDropdownOpen()) {
          <ul
            #dropdownMenu
            class="dropdown-content menu p-2 w-44 rounded-box bg-base-100 shadow-lg absolute top-10 right-0 z-10 border border-base-content/20"
          >
            <li>
              <button
                (click)="handleEdit()"
                class="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                <span>Rename</span>
              </button>
            </li>
            <li class="mt-1">
              <button
                (click)="handleDelete()"
                class="flex items-center gap-3 p-2 text-error hover:bg-error/10 rounded-lg transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                <span>Remove</span>
              </button>
            </li>
          </ul>
          }
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
    this.isDropdownOpen.update((isOpen) => !isOpen);
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
