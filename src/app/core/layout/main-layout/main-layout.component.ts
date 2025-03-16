import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {BottomNavComponent} from '../../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    BottomNavComponent
  ],
  template: `
    <section class="px-2 max-w-5xl mx-auto">
      <ng-content/>
      <app-bottom-nav/>
      <router-outlet/>
    </section>
  `,
  styles: ``
})
export class MainLayoutComponent {

}
