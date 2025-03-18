import {Routes} from '@angular/router';
import {MainLayoutComponent} from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'bookmarks',
        loadComponent: () => import('./pages/bookmarks/bookmarks.component').then(m => m.BookmarksComponent),
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
      },
      {
        path: 'collections',
        loadComponent: () => import('./pages/collections/collections.component').then(m => m.CollectionsComponent),
      },
      {
        path: 'tags',
        loadComponent: () => import('./pages/tags/tags.component').then(m => m.TagsComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
      }
    ]
  },

];
