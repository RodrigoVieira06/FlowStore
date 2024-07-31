import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SidenavComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    SidenavComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
