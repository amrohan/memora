import { Routes } from '@angular/router';
import { ShareTargetComponent } from '@components/share-target.component';
import { authGuard } from '@core/guards/auth.guard';
import { MainLayoutComponent } from '@core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'bookmarks',
  },
  { path: 'share-target', component: ShareTargetComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'bookmarks',
        loadComponent: () =>
          import('./pages/bookmarks/bookmarks.component').then(
            (m) => m.BookmarksComponent,
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/search/search.component').then(
            (m) => m.SearchComponent,
          ),
      },
      {
        path: 'collections',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/collections/collections.component').then(
                (m) => m.CollectionsComponent,
              ),
          },
          {
            path: ':collectionId',
            loadComponent: () =>
              import(
                './pages/bookmarks/collection-detail/collection-detail.component'
              ).then((m) => m.CollectionDetailComponent),
          },
        ],
      },
      {
        path: 'tags',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/tags/tags.component').then(
                (m) => m.TagsComponent,
              ),
          },
          {
            path: ':tagId',
            loadComponent: () =>
              import('./pages/tags/tag-detail/tag-detail.component').then(
                (m) => m.TagDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: '**',
    redirectTo: 'bookmarks',
    pathMatch: 'full',
  },
];
