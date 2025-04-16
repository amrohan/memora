import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '@components/header/header.component';
import { ModalComponent } from '@components/modal/modal.component';
import { TagsCardComponent } from '@components/tags-card/tags-card.component';
import { ApiResponse } from '@models/ApiResponse';
import { Tag } from '@models/tags.model';
import { TagService } from '@services/tag.service';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationComponent } from '../../components/pagination.component';

@Component({
  selector: 'app-tags',
  imports: [
    HeaderComponent,
    TagsCardComponent,
    ModalComponent,
    FormsModule,
    PaginationComponent,
  ],
  template: `
    <app-header headerName="Tags" />
    <section class="mb-36">
      <div class="h-20 flex justify-end items-center gap-2">
        <label class="input">
          <svg
            class="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            [(ngModel)]="searchTerm"
            name="tag"
            required
            placeholder="Search tags..."
          />
        </label>
        <button class="btn btn-primary" (click)="openCustomModal()">Add</button>
      </div>
      <article
        class="grid place-content-between items-start gap-4 grid-cols-1 md:grid-cols-3"
      >
        @for (item of data.value()?.data; track item.id) {
        <app-tags-card
          [tag]="item"
          (handleOnEdit)="handleTagEdit($event)"
          (handleOnDelete)="handleTagDelete($event)"
        />
        }
      </article>

      <div class="flex justify-center items-center mt-4">
        @if(data.value()?.metadata ){
        <app-pagination [(page)]="page" [data]="data.value()?.metadata" />
        }
      </div>
    </section>

    <!-- Modal-->
    <app-modal
      #customModal
      [title]="!isEditing() ? 'Add' : 'Edit'"
      [confirmText]="'Save Changes'"
      [cancelText]="'Discard'"
      [showCloseButton]="true"
      (confirmed)="handleConfirm()"
      (closed)="handleClose()"
    >
      <div class="form-control ">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tag</legend>
          <input
            type="text"
            [(ngModel)]="tagName"
            name="tagName"
            placeholder="Enter tag name..."
            class="input input-bordered w-full"
          />
        </fieldset>
      </div>
    </app-modal>
  `,
  styles: ``,
})
export class TagsComponent implements OnInit {
  private tagsService = inject(TagService);

  isEditing = signal<boolean>(false);
  tagName = signal<string>('');
  setTag = signal<Tag | null>(null);

  searchTerm = signal<string>('');
  pageSize = signal<number>(20);
  page = signal<number>(1);

  data = httpResource<ApiResponse<Tag[]>>(
    () =>
      `${
        environment.API_URL
      }/tags?search=${this.searchTerm()}&page=${this.page()}&pageSize=${this.pageSize()}`
  );

  customModal = viewChild.required<ModalComponent>('customModal');

  ngOnInit(): void {}

  openCustomModal() {
    this.customModal().open();
  }
  handleTagEdit(tag: Tag) {
    this.isEditing.set(true);
    this.tagName.set(tag.name);
    this.setTag.set(tag);
    this.customModal().open();
  }
  handleTagDelete(tag: Tag) {
    this.deleteTag(tag.id);
  }

  handleConfirm() {
    console.log('Modal confirmed');
    if (this.isEditing()) {
      this.updateTag();
    } else {
      this.createTag();
    }
    this.customModal().close();
  }

  handleClose() {
    this.clearFields();
  }

  createTag() {
    const tagName = this.tagName();
    if (!tagName) {
      console.error('Tag name is required');
      return;
    }
    const tag: Tag = {
      id: '',
      name: tagName,
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '',
    };

    this.tagsService.createTag(tag).subscribe({
      next: (response) => {},
      error: (error) => {
        console.error('Error creating tag:', error);
      },
    });
  }

  updateTag() {
    const tagName = this.tagName();
    if (!tagName) {
      console.error('Tag name is required');
      return;
    }
    const tag: Tag = {
      id: this.setTag()!.id,
      name: tagName,
      description: this.setTag()!.description || '',
      createdAt: this.setTag()!.createdAt,
      updatedAt: this.setTag()!.updatedAt,
      userId: this.setTag()!.userId,
    };
    this.tagsService.updateTag(tag).subscribe({
      next: (response) => {
        console.log('Tag updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating tag:', error);
      },
    });
  }

  deleteTag(tagId: string) {
    this.tagsService.deleteTag(tagId).subscribe({
      next: (response) => {},
      error: (error) => {
        console.error('Error deleting tag:', error);
      },
    });
  }

  clearFields() {
    this.tagName.set('');
    this.isEditing.set(false);
    this.setTag.set(null);
  }
}
