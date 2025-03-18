import {Component, signal, input, output, effect} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

interface Collection {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface ItemData {
  id: number;
  title: string;
  description: string;
  coverImage?: string;
  collection: Collection | null
  tags: Tag[];
}

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="drawer drawer-end">
      <input
        id="item-drawer"
        type="checkbox"
        class="drawer-toggle"
        [checked]="isOpen()"
        (change)="toggleDrawer($event)"/>

      <div class="drawer-content">
        <!-- Page content here -->
        <ng-content></ng-content>
      </div>

      <div class="drawer-side z-10">
        <label for="item-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

        <div class="bg-base-100 w-full lg:w-[30rem] min-h-full flex flex-col">
          <!-- Header -->
          <div
            class="p-4 bg-base-100 border-b border-base-content/20 flex justify-between items-center sticky top-0 z-10">
            <h3 class="text-lg font-medium text-base-content">Bookmark</h3>
            <div class="flex gap-2">
              <button class="btn btn-active btn-ghost btn-sm" (click)="visitItem()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                </svg>
                Visit
              </button>
              <button class="btn btn-ghost btn-sm" (click)="closeDrawer()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content - Scrollable -->
          <div class="flex-1 p-4 mb-20">
            @if (currentItemData()) {
              <!-- Cover Image -->
              <div class="w-full h-48 rounded-lg bg-base-200 mb-4">
                @if (currentItemData()?.coverImage) {
                  <img
                    [src]="currentItemData()!.coverImage"
                    alt="Cover image"
                    class="w-full h-full object-cover rounded-lg"
                  />
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-base-content/50">
                    No image available
                  </div>
                }
              </div>

              <!-- Title -->
              <h2 class="text-xl font-bold mb-2">{{ currentItemData()!.title }}</h2>

              <!-- Description -->
              <p class="text-base-content/70 mb-4">{{ currentItemData()!.description }}</p>

              <!-- Collection Selection - Single Collection -->
              <div class="form-control w-full mb-4">
                <label class="label mb-2">
                  <span class="label-text text-sm">Collection</span>
                </label>

                <div class="w-full">
                  <select
                    class="select select-bordered w-full"
                    [(ngModel)]="collectionSelection"
                    (ngModelChange)="updateCollection($event)">
                    <option value="">None</option>
                    @for (collection of availableCollectionsInternal(); track collection.id) {
                      <option [value]="collection.id">{{ collection.name }}</option>
                    }
                    <option value="new">+ Add new collection</option>
                  </select>
                </div>

                @if (isAddingNewCollection()) {
                  <div class="mt-2 join w-full">
                    <input
                      type="text"
                      class="input input-bordered join-item w-full"
                      placeholder="New collection name"
                      [(ngModel)]="newCollectionName"/>
                    <button
                      class="btn btn-primary join-item"
                      (click)="createAndSetCollection()">
                      Create
                    </button>
                  </div>
                }

                @if (selectedCollection()) {
                  <div class="flex flex-wrap gap-2 mt-2">
                    <div class="badge badge-secondary gap-1">
                      {{ selectedCollection()!.name }}
                      <button (click)="removeCollection()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              </div>

              <!-- Tags Selection -->
              <div class="form-control w-full">
                <label class="label mb-2">
                  <span class="label-text text-sm">Tags</span>
                </label>

                <div class="flex flex-wrap gap-2 mb-2">
                  @for (tag of selectedTags(); track tag.id) {
                    <div class="badge badge-primary gap-1">
                      {{ tag.name }}
                      <button (click)="removeTag(tag)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>

                <div class="join w-full">
                  <select
                    class="select select-bordered join-item w-full"
                    [(ngModel)]="newTagSelection"
                    (ngModelChange)="handleTagSelection($event)">
                    <option value="" disabled selected>Select a tag</option>
                    @for (tag of availableTagsInternal(); track tag.id) {
                      @if (!isTagSelected(tag.id)) {
                        <option [value]="tag.id">{{ tag.name }}</option>
                      }
                    }
                    <option value="new">+ Add new tag</option>
                  </select>
                </div>

                @if (isAddingNewTag()) {
                  <div class="mt-2 join w-full">
                    <input
                      type="text"
                      class="input input-bordered join-item w-full"
                      placeholder="New tag name"
                      [(ngModel)]="newTagName"/>
                    <button
                      class="btn btn-primary join-item"
                      (click)="createAndAddTag()">
                      Create
                    </button>
                  </div>
                }
              </div>
            } @else {
              <div class="flex items-center justify-center h-full">
                <p class="text-base-content/50">No item selected</p>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-base-content/20 bg-base-100 sticky bottom-0 flex justify-end gap-2">
            <button class="btn" (click)="closeDrawer()">Close</button>
            <button class="btn btn-primary" (click)="saveChanges()" [disabled]="!currentItemData()">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DrawerComponent {
  // Input properties
  itemId = input<number | null>(null);
  itemData = input<ItemData | null>(null);
  availableCollections = input<Collection[]>([]);
  availableTags = input<Tag[]>([]);

  // Output events
  drawerClosed = output<void>();
  itemSaved = output<{
    id: number,
    // title: string;
    // description: string;
    // coverImage?: string;
    collection: Collection | null,
    tags: Tag[]
  }>();
  itemVisit = output<number>();

  // State
  isOpen = signal<boolean>(false);
  currentItemData = signal<ItemData | null>(null);

  // Collection
  availableCollectionsInternal = signal<Collection[]>([]);
  selectedCollection = signal<Collection | null>(null);
  isAddingNewCollection = signal<boolean>(false);
  newCollectionName = '';
  collectionSelection = '';

  // Tags
  availableTagsInternal = signal<Tag[]>([]);
  selectedTags = signal<Tag[]>([]);
  isAddingNewTag = signal<boolean>(false);
  newTagName = '';
  newTagSelection = '';

  constructor() {
    // Effect to watch for changes to itemId and itemData
    effect(() => {
      const id = this.itemId();
      const data = this.itemData();

      if (id && data && data.id === id) {
        this.currentItemData.set(data);
        this.selectedCollection.set(data.collection);
        this.collectionSelection = data.collection ? String(data.collection.id) : '';
        this.selectedTags.set([...data.tags]);
        this.isOpen.set(true);
      } else if (id) {
        // If we have an ID but no data, we could fetch it from a service
        this.isOpen.set(true);
      } else {
        this.currentItemData.set(null);
      }
    });

    // Effect to watch for changes to available collections/tags
    effect(() => {
      this.availableCollectionsInternal.set([...this.availableCollections()]);
    });

    effect(() => {
      this.availableTagsInternal.set([...this.availableTags()]);
    });
  }

  openDrawer(): void {
    this.isOpen.set(true);
  }

  closeDrawer(): void {
    this.isOpen.set(false);
    this.resetNewItemForms();
    this.drawerClosed.emit();
  }

  toggleDrawer(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isOpen.set(isChecked);
    if (!isChecked) {
      this.resetNewItemForms();
      this.drawerClosed.emit();
    }
  }

  visitItem(): void {
    const itemData = this.currentItemData();
    if (itemData) {
      this.itemVisit.emit(itemData.id);
    }
  }

  // Check if tag is already selected
  isTagSelected(id: number): boolean {
    return this.selectedTags().some(t => t.id === id);
  }

  // Collection methods
  updateCollection(value: string): void {
    if (value === 'new') {
      this.isAddingNewCollection.set(true);
      return;
    }

    if (value === '') {
      // Selected "None" - remove collection
      this.selectedCollection.set(null);
      return;
    }

    const collectionId = parseInt(value);
    if (isNaN(collectionId)) return;

    const collection = this.availableCollectionsInternal().find(c => c.id === collectionId);
    if (collection) {
      this.selectedCollection.set(collection);
    }
  }

  createAndSetCollection(): void {
    if (!this.newCollectionName.trim()) return;

    // Generate a new ID (in a real app this would come from the backend)
    const maxId = Math.max(0, ...this.availableCollectionsInternal().map(c => c.id));
    const newCollection: Collection = {
      id: maxId + 1,
      name: this.newCollectionName.trim()
    };

    // Add to available collections
    this.availableCollectionsInternal.update(collections => [...collections, newCollection]);

    // Set as the selected collection
    this.selectedCollection.set(newCollection);
    this.collectionSelection = String(newCollection.id);

    // Reset
    this.newCollectionName = '';
    this.isAddingNewCollection.set(false);
  }

  removeCollection(): void {
    this.selectedCollection.set(null);
    this.collectionSelection = '';
  }

  // Tag methods
  handleTagSelection(value: string): void {
    if (value === 'new') {
      this.isAddingNewTag.set(true);
      return;
    }

    const tagId = parseInt(value);
    if (isNaN(tagId)) return;

    const tag = this.availableTagsInternal().find(t => t.id === tagId);
    if (tag && !this.isTagSelected(tagId)) {
      this.selectedTags.update(tags => [...tags, tag]);
      // Reset selection after adding
      this.newTagSelection = '';
    }
  }

  createAndAddTag(): void {
    if (!this.newTagName.trim()) return;

    // Generate a new ID (in a real app this would come from the backend)
    const maxId = Math.max(0, ...this.availableTagsInternal().map(t => t.id));
    const newTag: Tag = {
      id: maxId + 1,
      name: this.newTagName.trim()
    };

    // Add to available tags
    this.availableTagsInternal.update(tags => [...tags, newTag]);

    // Add to selected tags
    this.selectedTags.update(tags => [...tags, newTag]);

    // Reset
    this.newTagName = '';
    this.isAddingNewTag.set(false);
  }

  removeTag(tagToRemove: Tag): void {
    this.selectedTags.update(tags =>
      tags.filter(tag => tag.id !== tagToRemove.id)
    );
  }

  resetNewItemForms(): void {
    this.isAddingNewCollection.set(false);
    this.isAddingNewTag.set(false);
    this.newCollectionName = '';
    this.newTagName = '';
    this.newTagSelection = '';
  }

  saveChanges(): void {
    const itemData = this.currentItemData();
    if (!itemData) return;

    this.itemSaved.emit({
      id: itemData.id,
      collection: this.selectedCollection(),
      tags: [...this.selectedTags()]
    });
    this.closeDrawer();
  }
}

