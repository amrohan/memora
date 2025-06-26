import {Component, effect, ElementRef, HostListener, input, output, signal, ViewChild} from '@angular/core';
import {debouncedSignal} from '../utils/debounce-utils';

@Component({
  selector: 'app-search',
  imports: [],
  template: `
    <label class="input ">
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
        #searchRef
        type="search"
        class="w-44 md:w-60"
        [value]="rawSearchTerm()"
        (input)="rawSearchTerm.set(searchRef.value)"
        name="collection"
        required
        [placeholder]="placeHolder()||'Search collection...'"
      />
    </label>
  `,
})
export class SearchComponent {

  placeHolder = input<string>();

  searchChange = output<string>();

  rawSearchTerm = signal('');

  debouncedSearchTerm = debouncedSignal(this.rawSearchTerm, 500, '');

  @ViewChild('searchRef') searchRef!: ElementRef<HTMLInputElement>;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.searchRef.nativeElement.blur();
    }

    if (event.key === '/') {
      event.preventDefault();
      this.searchRef.nativeElement.focus();
    }
  }

  constructor() {
    effect(
      () => {
        const term = this.debouncedSearchTerm();
        this.searchChange.emit(term);
      },
    );
  }
}
