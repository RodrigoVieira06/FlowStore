import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsFormComponent } from './components/products-form/products-form.component';
import { ProductsComponent } from './products.component';

const routes: Routes = [
  {
    path: '', component: ProductsComponent, children: [
      { path: '', component: ProductsListComponent },
      { path: 'create', component: ProductsFormComponent },
      { path: 'edit/:barcode', component: ProductsFormComponent },
      { path: 'show/:barcode', component: ProductsFormComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingProductsModule { }
