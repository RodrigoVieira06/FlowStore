import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingProductsModule } from './app-routing-products.module';
import { ProductsFormComponent } from './components/products-form/products-form.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsComponent } from './products.component';
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';



@NgModule({
  declarations: [
    ProductsFormComponent,
    ProductsListComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingProductsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
],
  exports: [
    ProductsFormComponent,
    ProductsListComponent
  ]
})
export class ProductsModule { }
