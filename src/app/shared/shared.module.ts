import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ToasterComponent } from './components/toaster/toaster.component';


@NgModule({
  declarations: [
    SidenavComponent,
    HeaderComponent,
    LoadingComponent,
    ConfirmDialogComponent,
    ToasterComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule
  ],
  exports: [
    SidenavComponent,
    HeaderComponent,
    LoadingComponent,
    ConfirmDialogComponent,
    ToasterComponent
  ]
})
export class SharedModule { }
