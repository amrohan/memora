import {
  Component,
  signal,
  input,
  output,
  model,
  OnInit,
  inject,
  computed, linkedSignal,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Bookmark} from '@models/bookmark.model';
import {TagService} from '@services/tag.service';
import {CollectionService} from '@services/collection.service';
import {Collection} from '@models/collection.model';
import {Tag} from '@models/tags.model';
import {ToastService} from '@services/toast.service';

@Component({
  selector: 'app-drawer',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="drawer drawer-end">
      <input
        id="item-drawer"
        type="checkbox"
        class="drawer-toggle"
        [checked]="isOpen()"
        (change)="toggleDrawer($event)"
      />

      <div class="drawer-content">
        <ng-content></ng-content>
      </div>

      <div class="drawer-side z-10">
        <label
          for="item-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
          (click)="closeDrawer()"
        ></label>

        <div class="bg-base-100 w-full lg:w-[30rem] min-h-full flex flex-col">
          <div
            class="p-4 bg-base-100 border-b border-base-content/20 flex justify-between items-center sticky top-0 z-10"
          >
            <h3 class="text-lg font-medium text-base-content">
              Bookmark Details
            </h3>
            <div class="flex gap-2">
              <button
                class="btn btn-ghost btn-sm"
                (click)="visitItem()"
                [disabled]="!editableItemData()?.url"
                title="Visit Bookmark URL"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                Visit
              </button>
              <button
                class="btn btn-ghost btn-sm"
                (click)="closeDrawer()"
                title="Close Drawer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex-1 p-4 overflow-y-auto mb-20">
            @if (editableItemData(); as item) {
              <div
                class="w-full h-48 rounded-lg bg-base-200 mb-4 overflow-hidden"
              >
                @if (item.imageUrl) {
                  <img
                    [src]="item.imageUrl"
                    alt="Cover image for {{ item.title }}"
                    class="w-full h-full object-cover"
                  />
                } @else {
                  <div
                    class="w-full h-full flex items-center justify-center text-base-content/50"
                  >
                    No image available
                  </div>
                }
              </div>

              <input
                type="text"
                placeholder="Enter title"
                class="input input-ghost w-full text-xl font-bold mb-1 p-0 focus:bg-transparent focus:border-none focus:ring-0"
                [(ngModel)]="item.title"
              />

              <textarea
                placeholder="Enter description (optional)"
                class="textarea textarea-ghost w-full mb-4 p-0 text-base-content/70 focus:bg-transparent focus:border-none focus:ring-0 h-20 resize-none"
                [(ngModel)]="item.description"
              ></textarea>

              <fieldset class="fieldset mb-4">
                <label class="label">
                  <span class="label-text text-sm font-medium">URL</span>
                </label>
                <input
                  type="url"
                  class="input input-bordered w-full"
                  [(ngModel)]="item.url"
                  placeholder="https://example.com"
                  required
                />
              </fieldset>

              <div class="form-control w-full mb-4">
                <label class="label">
                <span class="label-text text-sm font-medium mb-1"
                >Collection</span
                >
                </label>
                <select
                  class="select select-bordered w-full"
                  [(ngModel)]="selectedCollectionId"
                  (ngModelChange)="updateCollectionSelection($event)"
                >
                  <option [ngValue]="null">None</option>
                  @for (collection of availableCollections(); track collection.id) {
                    <option [value]="collection.id">
                      {{ collection.name }}
                    </option>
                  }
                  <option value="--new--">+ Add new collection</option>
                </select>

                @if (isAddingNewCollection()) {
                  <div class="mt-2 join w-full">
                    <input
                      #newCollectionInput
                      type="text"
                      class="input input-bordered join-item w-full"
                      placeholder="New collection name"
                      [(ngModel)]="newCollectionName"
                      (keyup.enter)="createAndSetCollection()"
                    />
                    <button
                      class="btn btn-primary join-item"
                      (click)="createAndSetCollection()"
                      [disabled]="!newCollectionName().trim()"
                    >
                      Create
                    </button>
                  </div>
                }
              </div>

              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text text-sm font-medium">Tags</span>
                </label>

                <div class="flex flex-wrap gap-2 my-2 min-h-[2rem]">
                  @for (tag of selectedTags(); track tag.id) {
                    <div class="badge badge-primary gap-1 items-center">
                      {{ tag.name }}
                      <button
                        (click)="removeTag(tag)"
                        class="ml-1 hover:text-primary-content/70"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          class="w-3 h-3"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  } @empty {
                    <span class="text-xs text-base-content/50 italic"
                    >No tags added</span
                    >
                  }
                </div>

                <div class="join w-full">
                  <select
                    class="select select-bordered join-item w-full"
                    [(ngModel)]="tagToAddSelection"
                    (ngModelChange)="handleTagSelectionChange($event)"
                  >
                    <option value="" disabled selected>
                      Add or create a tag...
                    </option>
                    @for (tag of availableTagsForSelection(); track tag.id) {
                      <option [value]="tag.id">{{ tag.name }}</option>
                    }
                    <option value="--new--">+ Create new tag</option>
                  </select>
                </div>

                @if (isAddingNewTag()) {
                  <div class="mt-2 join w-full">
                    <input
                      #newTagInput
                      type="text"
                      class="input input-bordered join-item w-full"
                      placeholder="New tag name"
                      [(ngModel)]="newTagName"
                      (keyup.enter)="createAndAddTag()"
                    />
                    <button
                      class="btn btn-primary join-item"
                      (click)="createAndAddTag()"
                      [disabled]="!newTagName().trim()"
                    >
                      Create & Add
                    </button>
                  </div>
                }
              </div>
            } @else {
              <div class="flex items-center justify-center h-full pt-20">
              <span
                class="loading loading-spinner loading-md text-base-content/50"
              ></span>
              </div>
            }
          </div>

          <div
            class="p-4 border-t border-base-content/20 bg-base-100 sticky bottom-0 flex justify-end gap-2"
          >
            <button class="btn btn-ghost" (click)="closeDrawer()">
              Cancel
            </button>
            <button
              class="btn btn-primary"
              (click)="saveChanges()"
              [disabled]="!editableItemData()"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DrawerComponent implements OnInit {
  itemData = input<Bookmark | null>(null);
  isOpen = model<boolean>(false);

  drawerClosed = output<void>();
  itemSaved = output<Bookmark>();
  itemVisit = output<string>();

  // --- Services ---
  private tagService = inject(TagService);
  private collectionService = inject(CollectionService);
  private toast = inject(ToastService);

  // --- Internal State Signals ---
  editableItemData = signal<Bookmark | null>(null);

  // Collection State
  availableCollections = linkedSignal(() => this.collectionService.paginatedCollections())
  selectedCollectionId = signal<string | null>(null);
  isAddingNewCollection = signal<boolean>(false);
  newCollectionName = signal<string>('');

  // Tag State
  availableTags = linkedSignal(() => this.tagService.paginatedTags());
  selectedTags = signal<Tag[]>([]);
  isAddingNewTag = signal<boolean>(false);
  newTagName = signal<string>('');
  tagToAddSelection = signal<string>('');

  // --- Computed Signals ---
  // Filter available tags to exclude already selected ones for the dropdown
  availableTagsForSelection = computed(() => {
    const selectedTagIds = new Set(this.selectedTags().map((t) => t.id));
    return this.availableTags().filter((tag) => !selectedTagIds.has(tag.id));
  });

  ngOnInit(): void {
    const currentItem = this.itemData();
    this.editableItemData.set(currentItem);
    // set selected tags based on the current item
    if (currentItem) {
      this.selectedTags.set(currentItem.tags);
      this.selectedCollectionId.set(currentItem.collections?.[0]?.id ?? null);
    }
    // set collection id based on the current item
    if (currentItem?.collections?.length) {
      this.selectedCollectionId.set(currentItem.collections[0].id);
    }
  }

  // --- Drawer Lifecycle ---
  openDrawer(): void {
    this.isOpen.set(true);
  }

  closeDrawer(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.resetNewItemForms();
      this.editableItemData.set(null);
      this.drawerClosed.emit();
    }
  }

  toggleDrawer(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    // The model signal 'isOpen' is already updated by the checkbox binding.
    if (!isChecked) {
      this.closeDrawer();
    }
  }

  // --- Actions ---
  visitItem(): void {
    const item = this.editableItemData();
    if (item?.url) {
      window.open(item.url, '_blank');
      // this.itemVisit.emit(item.id);
    }
  }

  saveChanges(): void {
    const editedItem = this.editableItemData();
    if (!editedItem) return;
    const collection = this.availableCollections().find(
      (c) => c.id === this.selectedCollectionId()
    );

    if (!collection) {
      this.toast.error(
        'Selected collection not found in available collections.'
      );
      return;
    }

    // Prepare the final bookmark data to save/emit
    const finalBookmark: Bookmark = {
      ...editedItem,
      tags: this.selectedTags(),
      collections: [collection],
    };

    this.itemSaved.emit(finalBookmark);
    this.closeDrawer();
  }

  // --- Collection Management ---
  getAllCollections() {
    this.collectionService.paginatedCollections()
  }

  updateCollectionSelection(value: string | null): void {
    console.log('Collection selected:', value);
    this.isAddingNewCollection.set(false);
    if (value === '--new--') {
      this.selectedCollectionId.set(null);
      this.isAddingNewCollection.set(true);
      // Optionally focus the input field #newCollectionInput here
    } else {
      // Value is either a collection ID or null (for "None")
      this.selectedCollectionId.set(value);
    }
  }

  createAndSetCollection(): void {
    const name = this.newCollectionName().trim();
    if (!name) return;

    const newCollection: Partial<Collection> = {name};

    // Call API
    this.collectionService
      .createCollection(newCollection as Collection)
      .subscribe({
        next: ({data: createdCollection}) => {
          if (createdCollection) {
            // Add to available list
            this.availableCollections.update((list) => [
              ...list,
              createdCollection,
            ]);
            // Select the newly created collection
            this.selectedCollectionId.set(createdCollection.id);
            this.resetNewItemForms(); // Clear name input and hide form
          } else {
            console.error('Collection creation API did not return data.');
            // Handle error feedback to user
          }
        },
        error: (error) => {
          this.toast.error(error.error.message);
        },
      });
  }


  handleTagSelectionChange(value: string): void {
    this.isAddingNewTag.set(false);

    if (value === '--new--') {
      this.isAddingNewTag.set(true);
      this.tagToAddSelection.set('');
    } else if (value) {
      const selectedTag = this.availableTags().find((t) => t.id === value);
      if (selectedTag && !this.isTagSelected(selectedTag.id)) {
        this.selectedTags.update((currentTags) => [
          ...currentTags,
          selectedTag,
        ]);
      }
      this.tagToAddSelection.set('');
    }
  }

  createAndAddTag(): void {
    const name = this.newTagName().trim();
    if (!name) return;

    const newTag: Partial<Tag> = {name};

    this.tagService.createTag(newTag as Tag).subscribe({
      next: ({data: createdTag}) => {
        if (createdTag) {
          if (!this.availableTags().some((t) => t.id === createdTag.id)) {
            this.availableTags.update((list) => [...list, createdTag]);
          }
          // Add to selected list if not already selected
          if (!this.isTagSelected(createdTag.id)) {
            this.selectedTags.update((list) => [...list, createdTag]);
          }
          this.resetNewItemForms();
        } else {
          this.toast.error('Tag creation API did not return data.');
        }
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }

  removeTag(tagToRemove: Tag): void {
    this.selectedTags.update((tags) =>
      tags.filter((tag) => tag.id !== tagToRemove.id)
    );
  }

  isTagSelected(id: string): boolean {
    return this.selectedTags().some((t) => t.id === id);
  }

  resetNewItemForms(): void {
    this.isAddingNewCollection.set(false);
    this.isAddingNewTag.set(false);
    this.newCollectionName.set('');
    this.newTagName.set('');
    this.tagToAddSelection.set('');
  }
}
