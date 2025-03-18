import {Component, signal, viewChild} from '@angular/core';
import {HeaderComponent} from '@components/header/header.component';

@Component({
  selector: 'app-search',
  imports: [
    HeaderComponent,
  ],
  template: `
    <app-header headerName="Search"/>
  `,
})
export class SearchComponent {

}
