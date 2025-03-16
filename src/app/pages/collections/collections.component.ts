import {Component} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-collections',
  imports: [
    HeaderComponent
  ],
  template: `
    <app-header headerName="Collection"/>
  `,
  styles: ``
})
export class CollectionsComponent {

}
