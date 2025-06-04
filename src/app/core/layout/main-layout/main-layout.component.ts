import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomDockComponent } from '@components/bottom-nav/bottom-dock.component';
import { SideNavBarComponent } from '@components/bottom-nav/side-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, BottomDockComponent, SideNavBarComponent],
  template: `
    <section class="flex h-screen antialiased ">
      <app-side-nav-bar class="hidden md:block" />
      <main class="flex-1 overflow-y-auto p-4 md:p-6 md:ml-60 pb-20 md:pb-4">
        <router-outlet />
      </main>

      <app-bottom-dock />
    </section>
  `,
})
export class MainLayoutComponent {}
