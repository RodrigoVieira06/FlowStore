import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'manufacturers', loadChildren: () => import('./pages/manufacturers/manufacturers.module').then(m => m.ManufacturersModule) },
  { path: 'products', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule) },
  { path: '', redirectTo: '/manufacturers', pathMatch: 'full' },
  { path: '**', redirectTo: '/manufacturers' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
