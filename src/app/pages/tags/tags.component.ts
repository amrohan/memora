import {httpResource} from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ModalComponent} from '@components/modal/modal.component';
import {TagsCardComponent} from '@components/tags-card/tags-card.component';
import {Tag} from '@models/tags.model';
import {TagService} from '@services/tag.service';
import {PaginationComponent} from '@components/pagination.component';
import {ToastService} from '@services/toast.service';
import {SearchComponent} from '@components/search.component';

@Component({
  selector: 'app-tags',
  imports: [
    TagsCardComponent,
    ModalComponent,
    FormsModule,
    PaginationComponent,
    SearchComponent,
  ],
  template: `
    <section class="mb-36 mt-10">
      <div class="h-16 flex justify-end items-start gap-2">
        <app-search (searchChange)="tagsService.searchTerm.set($event)"
                    placeHolder="Search tags... "/>
        <button class="btn btn-primary" (click)="openCustomModal()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4 text-current"
          >
            <path
              d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
            />
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>
          </svg>

          Add
        </button>
      </div>
      <article
        class="grid place-content-between items-start gap-4 grid-cols-1 md:grid-cols-3"
      >
        @for (item of tagsService.paginatedTags(); track item.id) {
          <app-tags-card
            [tag]="item"
            (handleOnEdit)="handleTagEdit($event)"
            (handleOnDelete)="handleTagDelete($event)"
          />
        }
      </article>
      <!-- Skeleton -->
      @if (tagsService.isLoading() && !tagsService.paginatedTags().length) {
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-2 animate-fade">
          @for (item of [1, 2, 3, 4, 5, 6]; track $index) {
            <div class="skeleton h-18 w-full"></div>
          }
        </div>
      }
      <div class="flex justify-center items-center mt-4">
        @if (tagsService.metaData()) {
          <app-pagination [(page)]="tagsService.page" [data]="tagsService.metaData()"
                          [isLoading]="tagsService.isLoading()"/>
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
      (keydown.enter)="handleConfirm()"
      (closed)="handleClose()"
    >
      <div class="form-control ">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tag</legend>
          <input
            #tagInput
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
})
export class TagsComponent implements OnInit {
  tagsService = inject(TagService);
  private toast = inject(ToastService);

  isEditing = signal<boolean>(false);
  tagName = signal<string>('');
  setTag = signal<Tag | null>(null);


  customModal = viewChild.required<ModalComponent>('customModal');

  @ViewChild('tagInput') tagInputRef!: ElementRef<HTMLInputElement>;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.customModal().isOpen()) {
        this.customModal()?.close();
      } else {
        this.customModal()?.close();
      }
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openCustomModal();
    }
  }

  ngOnInit(): void {
  }

  openCustomModal() {
    this.customModal().open();
    setTimeout(() => {
      this.tagInputRef?.nativeElement.focus();
    }, 100);
  }

  handleTagEdit(tag: Tag) {
    this.isEditing.set(true);
    this.tagName.set(tag.name);
    this.setTag.set(tag);
    this.customModal().open();
    setTimeout(() => {
      this.tagInputRef?.nativeElement.focus();
    }, 100);
  }

  handleTagDelete(tag: Tag) {
    this.deleteTag(tag.id);
  }

  handleConfirm() {
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
      this.toast.error('Tag name is required');
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
      next: (response) => {
        this.toast.success(response.message);
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }

  updateTag() {
    const tagName = this.tagName();
    if (!tagName) {
      this.toast.error('Tag name is required');
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
        this.toast.success(response.message);
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }

  deleteTag(tagId: string) {
    this.tagsService.deleteTag(tagId).subscribe({
      next: (response) => {
        this.toast.success(response.message);
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }

  clearFields() {
    this.tagName.set('');
    this.isEditing.set(false);
    this.setTag.set(null);
  }
}
