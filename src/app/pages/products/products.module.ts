import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingProductsModule } from './app-routing-products.module';
import { ProductsFormComponent } from './components/products-form/products-form.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsComponent } from './products.component';
import { SharedModule } from "../../shared/shared.module";



@NgModule({
  declarations: [
    ProductsFormComponent,
    ProductsListComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingProductsModule,
    SharedModule
],
  exports: [
    ProductsFormComponent,
    ProductsListComponent
  ]
})
export class ProductsModule { }
