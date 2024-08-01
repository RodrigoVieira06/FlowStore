import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';


@NgModule({
  declarations: [
    SidenavComponent,
    HeaderComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    SidenavComponent,
    HeaderComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
