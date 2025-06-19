import { Routes } from '@angular/router';
import { ShareTargetComponent } from '@components/share-target.component';
import { authGuard } from '@core/guards/auth.guard';
import { MainLayoutComponent } from '@core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'share-target', component: ShareTargetComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'bookmarks',
      },
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
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./pages/auth/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/auth/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'generate-access-code',
    loadComponent: () =>
      import('./pages/auth/access-auth-token.component').then(
        (m) => m.AccessTokenAuthComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'bookmarks',
    pathMatch: 'full',
  },
];
