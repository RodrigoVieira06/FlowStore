import { Component, HostListener } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public sidenavMode: MatDrawerMode;
  public sidenavOpened: boolean;

  constructor() {
    if (typeof window !== "undefined" && window.innerWidth > 1050) {
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
    } else {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth < 1050) {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
    } else {
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
    }
  }
}
