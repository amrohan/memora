import {Component, signal, viewChild} from '@angular/core';
import {HeaderComponent} from '@components/header/header.component';
import {ModalComponent} from '@components/modal/modal.component';
import {DrawerComponent} from '@components/drawer/drawer.component';

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
  selector: 'app-bookmarks',
  imports: [
    HeaderComponent,
    ModalComponent,
    DrawerComponent
  ],
  template: `
    <app-header headerName="Bookmarks"/>

    <section>
      <div class="h-20 flex justify-end items-center gap-2">
        <label class="input">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" required placeholder="Search bookmarks..."/>
        </label>
        <button class="btn btn-primary" (click)="openCustomModal()">Add</button>
      </div>
    </section>


    <!-- Modal-->
    <app-modal
      #customModal
      [title]="!isEditing() ?'Add Bookmark':'Edit Bookmark'"
      [confirmText]="'Save Changes'"
      [cancelText]="'Discard'"
      [showCloseButton]="true"
      (confirmed)="handleConfirm()"
      (closed)="handleClose()">
      <div class="form-control">
        <legend class="fieldset-legend text-sm text-base-content">URL</legend>
        <label class="input validator w-full">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </g>
          </svg>
          <input type="url" class=" w-full" required placeholder="https://" value="https://"
                 pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                 title="Must be valid URL"/>
        </label>
      </div>
    </app-modal>


    <button class="btn btn-primary" (click)="openDrawer(1)">Open Item 1</button>
    <button class="btn btn-secondary ml-2" (click)="openDrawer(2)">Open Item 2</button>

    <app-drawer
      [itemId]="selectedItemId()"
      [itemData]="selectedItemData()"
      [availableCollections]="mockCollections()"
      [availableTags]="mockTags()"
      (drawerClosed)="handleDrawerClosed()"
      (itemSaved)="handleItemSaved($event)"
      (itemVisit)="handleItemVisit($event)">
    </app-drawer>
  `
})
export class BookmarksComponent {

  isEditing = signal<boolean>(false);

  customModal = viewChild.required<ModalComponent>('customModal');

  openCustomModal() {
    this.customModal().open();
  }

  handleConfirm() {
    console.log('Modal confirmed');
  }

  handleClose() {
    console.log('Modal closed');
  }

  selectedItemId = signal<number | null>(null);
  selectedItemData = signal<ItemData | null>(null);

  // Mock data
  mockItems = signal<ItemData[]>([
    {
      id: 1,
      title: "Notion",
      description: "Write. Plan. Collaborate. With a little help from AI. ",
      coverImage: "https://www.notion.com/front-static/meta/default.png",
      collection: {id: 1, name: "Work"},
      tags: [{id: 1, name: "Important"}, {id: 3, name: "Reference"}]
    },
    {
      id: 2,
      title: "Vacation Planning",
      description: "Notes and links for upcoming summer vacation plans.",
      coverImage: "https://via.placeholder.com/400x200?text=Vacation",
      collection: {id: 2, name: "Personal"},
      tags: [{id: 4, name: "Follow-up"}]
    }
  ]);

  mockCollections = signal<Collection[]>([
    {id: 1, name: "Work"},
    {id: 2, name: "Personal"},
    {id: 3, name: "Archive"},
    {id: 4, name: "Projects"}
  ]);

  mockTags = signal<Tag[]>([
    {id: 1, name: "Important"},
    {id: 2, name: "Urgent"},
    {id: 3, name: "Reference"},
    {id: 4, name: "Follow-up"},
    {id: 5, name: "Review"}
  ]);

  openDrawer(id: number): void {
    this.selectedItemId.set(id);
    // Find the selected item in our mock data
    const item = this.mockItems().find(item => item.id === id);
    this.selectedItemData.set(item || null);
  }

  handleDrawerClosed(): void {
    this.selectedItemId.set(null);
    this.selectedItemData.set(null);
    console.log('Drawer closed');
  }

  handleItemSaved(data: { id: number, collection: Collection | null, tags: Tag[] }): void {
    console.log('Item saved:', data);

    // Update mock data
    // this.mockItems.update(items =>
    //   items.map(item =>
    //     item.id === data.id
    //       ? {...item, collections: data.collections, tags: data.tags}
    //       : item
    //   )
    // );
  }

  handleItemVisit(id: number): void {
    console.log('Visiting item:', id);
    // Navigate to item page
  }
}
