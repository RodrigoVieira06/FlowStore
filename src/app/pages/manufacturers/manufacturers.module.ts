import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingManufacturersModule } from './app-routing-manufacturers.module';
import { ManufacturersFormComponent } from './components/manufacturers-form/manufacturers-form.component';
import { ManufacturersListComponent } from './components/manufacturers-list/manufacturers-list.component';
import { ManufacturersComponent } from './manufacturers.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';



@NgModule({
  declarations: [
    ManufacturersFormComponent,
    ManufacturersListComponent,
    ManufacturersComponent
  ],
  imports: [
    CommonModule,
    AppRoutingManufacturersModule,
    SharedModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  exports: [
    ManufacturersFormComponent,
    ManufacturersListComponent
  ],
  bootstrap: [ManufacturersComponent]
})
export class ManufacturersModule { }
