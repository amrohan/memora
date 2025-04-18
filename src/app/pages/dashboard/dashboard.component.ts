import { Component } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { httpResource } from '@angular/common/http';
import { ApiResponse } from '@models/ApiResponse';
import { environment } from 'src/environments/environment';
import { TotalCounts } from '@models/dashboard';
import { RouterLink } from '@angular/router';
import { Bookmark } from '@models/bookmark.model';
import { BookmarkCardComponent } from '../../components/bookmark-card/bookmark-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, RouterLink, BookmarkCardComponent],
  template: `
    <app-header headerName="Dashboard" />
    <section>
      <!--  Stats-->
      <div class="stats bg-base-100 border border-base-300 mx-auto flex">
        <!--    Total-->
        <div class="stat w-full">
          <a [routerLink]="['/bookmarks']">
            <div class="stat-title">Total Bookmarks</div>
            <div class="stat-value">
              {{ data.value()?.data?.bookmarksCount }}
            </div>
          </a>
        </div>
        <!--    Collection-->
        <div class="stat w-full">
          <a [routerLink]="['/collections']">
            <div class="stat-title">Total Collection</div>
            <div class="stat-value">
              {{ data.value()?.data?.collectionsCount }}
            </div>
          </a>
        </div>
      </div>

      <main
        class="my-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4"
      >
        <!-- Recents-->
        <div class="card bg-base-100 w-full">
          <div class="card-body p-0 md:p-4">
            <h2 class="card-title text-base-content text-sm mb-2">Recents</h2>
            <main class="grid grid-cols-1 gap-4 p-4">
              @for (item of recentBookmarks.value()?.data; track item.id) {
              <app-bookmark-card [bookmark]="item" />
              } @if(recentBookmarks.value()?.data?.length === 0){
              <div
                class="col-span-1 sm:col-span-2 h-52 flex justify-center items-center"
              >
                <p class="text-center text-gray-500">
                  No recods found. Please add a bookmark.
                </p>
              </div>
              }
            </main>
            <div class="card-actions justify-end">
              <a [routerLink]="['/bookmarks']">
                <button class="btn btn-ghost">View more</button>
              </a>
            </div>
          </div>
        </div>
        <!--Favourites-->
        <!-- <div class="card bg-base-100 w-full">
          <div class="card-body p-0 md:p-4">
            <h2 class="card-title text-base-content text-sm mb-2">Favorites</h2>
            <div class="card-actions justify-end">
              <a [routerLink]="['/bookmarks']">
                <button class="btn btn-ghost">View more</button>
              </a>
            </div>
          </div>
        </div> -->
      </main>
    </section>
  `,
})
export class DashboardComponent {
  data = httpResource<ApiResponse<TotalCounts>>(
    () => `${environment.API_URL}/bookmarks/count`
  );

  recentBookmarks = httpResource<ApiResponse<Bookmark[]>>(
    () => `${environment.API_URL}/dashboard/recent-bookmarks`
  );
}
