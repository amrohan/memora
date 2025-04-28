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
import { Bookmark } from '@models/bookmark.model';

@Component({
  selector: 'app-bookmark-card',
  imports: [RouterLink],
  template: `
    <div class="card card-border bg-base-100 h-80 md:h-[24.5rem]">
      <div class="card-body w-full p-3 md:p-5">
        <div class="flex-col flex gap-2 w-full">
          <div class="avatar">
            <div class="h-36 md:h-48 w-full rounded-md">
              <a [href]="bookmark().url" target="_blank" class="w-full h-full">
                @if(bookmark().imageUrl){
                <img [src]="bookmark().imageUrl" class="object-cover" />
                }@else {
                <div
                  class="w-full h-full text-base-content/60 grid place-content-center"
                >
                  No image found for this url...
                </div>

                }
              </a>
            </div>
          </div>
          <div class="flex flex-col w-full">
            <div class="flex flex-col justify-center items-start gap-0.5">
              <!-- tags-->

              <a
                [href]="bookmark().url"
                target="_blank"
                class="w-full h-full flex flex-col gap-1.5 mt-2"
              >
                <p
                  class="text-sm md:text-base font-bold text-base-content line-clamp-1 hover:underline underline-offset-2 decoration-wavy decoration-accent"
                >
                  @if (!bookmark().title) { Untitled }
                  {{ bookmark().title }}
                </p>
                <p
                  class="text-xs md:text-sm text-base-content/80 line-clamp-2 hover:underline underline-offset-2 decoration-wavy decoration-accent"
                >
                  {{ bookmark().description }}
                </p>
              </a>

              <!--tags  -->
              <div class="h-4 mb-2 mt-3 flex justify-start items-center gap-2">
                @for (tag of bookmark().tags; track tag.id) {
                <a
                  [routerLink]="['/bookmarks']"
                  [queryParams]="{ tagId: tag.id, tagName: tag.name }"
                  class="badge badge-outline badge-sm rounded-md cursor-pointer "
                >
                  #{{ tag.name }}
                </a>
                }
              </div>
              <div
                class="flex w-full justify-between items-center dropdown dropdown-end relative"
              >
                <!--Collection Ui-->
                @for (collection of bookmark().collections; track collection.id)
                {
                <a
                  [routerLink]="['/bookmarks']"
                  [queryParams]="{
                    collectionId: collection.id,
                    collectionName: collection.name
                  }"
                  class="badge badge-primary badge-sm rounded-md cursor-pointer flex justify-start items-center gap-2"
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
                    class="size-3.5"
                  >
                    <path
                      d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
                    />
                  </svg>
                  <p>{{ collection.name }}</p>
                </a>
                }
                <button
                  #dropdownTrigger
                  class="btn btn-sm btn-ghost btn-circle"
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
                      class="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg transition-all duration-200"
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
                      class="flex items-center gap-3 p-2 text-error hover:bg-error/10 rounded-lg transition-all duration-200"
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
      </div>
    </div>
  `,
})
export class BookmarkCardComponent {
  bookmark = input.required<Bookmark>();
  isDropdownOpen = signal(false);
  handleOnEdit = output<Bookmark>();
  handleOnDelete = output<Bookmark>();

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
    this.handleOnEdit.emit(this.bookmark());
    this.isDropdownOpen.set(false);
  }

  handleDelete() {
    this.handleOnDelete.emit(this.bookmark());
    this.isDropdownOpen.set(false);
  }
}
