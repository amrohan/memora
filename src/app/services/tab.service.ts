import { Injectable, signal } from "@angular/core";


@Injectable({
  providedIn: 'root',
})
export class TabService {

  selectedTab = signal<string>("Profile");

  setSelectedTab(tab: string) {
    this.selectedTab.set(tab)
  }
}
