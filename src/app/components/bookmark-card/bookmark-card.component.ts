import {
  Component,
  input,
  output,
  computed,
  signal,
  inject,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Bookmark } from '@models/bookmark.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookmark-card',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div
      class="card bg-base-100 overflow-hidden border border-base-200"
      [class.pulse]="isLoading()"
    >
      <div class="card-body p-4 pb-3 gap-1">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2 flex-1 min-w-0">
            @if (bookmark().imageUrl) {
            <div class="relative flex-shrink-0">
              <img
                [src]="bookmark().imageUrl"
                alt="Favicon"
                class="w-6 h-6 rounded-sm object-cover bg-base-200"
                loading="lazy"
                (error)="handleImageError($event)"
              />
              <div
                class="absolute inset-0 bg-base-200 opacity-0 rounded-sm"
              ></div>
            </div>
            } @else {
            <div
              class="w-6 h-6 rounded-sm flex items-center justify-start sbg-base-200 text-base-content flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                ></path>
                <path
                  d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                ></path>
              </svg>
            </div>
            }
            <div class="flex flex-col items-start ">
            <div class="text-base font-medium line-clamp-1">
              <a
                [href]="bookmark().url"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline underline-offset-1 decoration-wavy decoration-accent"
              >
                {{ bookmark().title || 'Untitled' }}
              </a>
            </div>
              <!-- Link -->
              <a
                [href]="bookmark().url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm hover:text-accent truncate inline-block text-base-content/70 ml-0.5"
              >
                {{ formattedUrl() }}
              </a>
            </div>
          </div>

          <div class="flex gap-1 items-start">
            <div #dropdownTrigger class=" relative">
              <button
                (click)="isDropdownOpen.set(!isDropdownOpen())"
                tabindex="0"
                role="button"
                class="btn btn-ghost btn-sm btn-square opacity-70 hover:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              @if (isDropdownOpen()) {
              <ul
                #dropdownMenu
                tabindex="0"
                class="animte-fade z-10 menu absolute p-2 shadow bg-base-100 rounded-box w-52 -left-48"
              >
                <li><a (click)="onEdit(bookmark())">Edit</a></li>
                <li>
                  <a (click)="onDelete(bookmark())" class="text-error"
                    >Delete</a
                  >
                </li>
              </ul>
              }
            </div>
          </div>
        </div>

        <!-- Card content -->
        <div class="mt-2.5 mb-1.5">
          <a [href]="bookmark().url" target="_blank" rel="noopener noreferrer">
            @if (bookmark().description) {
            <p class="text-sm text-base-content line-clamp-2 min-h-10">
              {{ bookmark().description }}
            </p>
            } @else {
            <p class="text-xs text-base-content/50 line-clamp-2 min-h-10 italic">
              No description
            </p>
            }
          </a>
        </div>

        <!-- Tags as clickable buttons -->
        <div class="mt-1 h-6">
          @for (tag of bookmark().tags; track tag.id) {
          <button
            class="badge badge-sm badge-ghost text-xs hover:bg-base-200 cursor-pointer "
            (click)="navigateToTag(tag.id, tag.name)"
          >
            # {{ tag.name }}
          </button>
          } @if (bookmark().tags && bookmark().tags.length > 2) {
          <div class="dropdown dropdown-top">
            <div
              tabindex="0"
              role="button"
              class="badge badge-sm badge-ghost text-xs cursor-pointer"
            >
              +{{ bookmark().tags.length - 2 }}
            </div>
            <ul
              tabindex="0"
              class="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52 max-h-64 overflow-y-auto"
            >
              @for (tag of bookmark().tags.slice(2); track tag.id) {
              <li>
                <a (click)="navigateToTag(tag.id, tag.name)">{{ tag.name }}</a>
              </li>
              }
            </ul>
          </div>
          }
        </div>
      </div>

      <!-- Card footer -->
      <div
        class="flex items-center justify-between bg-base-100 px-4 py-2 border-t border-base-200"
      >
        <div class="flex flex-wrap gap-1 max-w-48 overflow-hidden">
          <!-- Collection - if present, make it clickable -->
          @if (bookmark().collections) { @for (item of bookmark().collections;
          track item.id) {
          <div class="mt-1">
            <button
              class="cursor-pointer text-sm flex items-center gap-1 hover:text-secondary transition-colors badge badge-ghost badge-sm"
              (click)="navigateToCollection(item.id, item.name)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3 relative"
              >
                <path
                  d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
                />
              </svg>
              {{ item.name }}
            </button>
          </div>
          } }
        </div>

        <!-- Date -->
        <div class="text-xs text-base-content/50">
          {{ bookmark().createdAt | date : 'MMM d yyyy' }}
        </div>
      </div>

      <!-- Touch-friendly overlay version for larger screens only -->
      <!-- <div
        class="absolute inset-0 bg-base-300/30 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center gap-3 backdrop-blur-sm"
      >
        <button
          class="btn btn-circle btn-sm btn-ghost"
          (click)="onEdit(bookmark())"
          title="Edit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            ></path>
            <path
              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            ></path>
          </svg>
        </button>
        <a
          [href]="bookmark().url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-circle btn-sm btn-primary"
          title="Visit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            ></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
        <button
          class="btn btn-circle btn-sm btn-ghost text-error"
          (click)="onDelete(bookmark())"
          title="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            ></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div> -->
    </div>
  `,
})
export class BookmarkCardComponent {
  bookmark = input.required<Bookmark>();
  handleOnEdit = output<Bookmark>();
  handleOnDelete = output<Bookmark>();
  handleOnVisit = output<string>();
  tagClick = output<{ id: string; name: string }>();
  collectionClick = output<{ id: string; name: string }>();

  isLoading = signal<boolean>(false);
  private router = inject(Router);

  isDropdownOpen = signal(false);

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

  formattedUrl = computed(() => {
    try {
      const urlObj = new URL(this.bookmark().url);
      return urlObj.hostname;
    } catch (e) {
      return this.bookmark().url;
    }
  });

  onEdit(bookmark: Bookmark): void {
    this.isDropdownOpen.set(false);
    this.handleOnEdit.emit(bookmark);
  }

  onDelete(bookmark: Bookmark): void {
    this.isDropdownOpen.set(false);
    this.handleOnDelete.emit(bookmark);
  }

  // onVisit(bookmark: Bookmark): void {
  //   this.handleOnVisit.emit(bookmark.id);
  // }

  navigateToTag(tagId: string, tagName: string): void {
    this.tagClick.emit({ id: tagId, name: tagName });
    this.router.navigate([], {
      queryParams: {
        tagId,
        tagName,
        collectionId: null,
        collectionName: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  navigateToCollection(collectionId: string, collectionName: string): void {
    this.collectionClick.emit({ id: collectionId, name: collectionName });
    this.router.navigate([], {
      queryParams: {
        collectionId,
        collectionName,
        tagId: null,
        tagName: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
  }
}
