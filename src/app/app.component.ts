import { Component, HostListener } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { MainEnums } from './shared/enums/enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public sidenavMode: MatDrawerMode;
  public sidenavOpened: boolean;

  private enums = MainEnums;

  constructor() {
    if (typeof window !== "undefined" && window.innerWidth > this.enums.SIDENAV_OPENED_PAGE_SIZE) {
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
    } else {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth < this.enums.SIDENAV_OPENED_PAGE_SIZE) {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
    } else {
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
    }
  }
}
