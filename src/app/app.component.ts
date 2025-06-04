import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container.component';
import { ThemeService } from '@services/theme.service';
import { TagService } from '@services/tag.service';
import { CollectionService } from '@services/collection.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <app-toast-container />
    <router-outlet />
  `,
})
export class AppComponent {
  title = 'Memora';
  private theme = inject(ThemeService);
  private tagsService = inject(TagService);
  private collectionService = inject(CollectionService);
}
