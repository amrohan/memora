import {Component} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {BookmarkCardComponent} from '../../components/bookmark-card/bookmark-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    HeaderComponent,
    BookmarkCardComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

}
