import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManufacturersListComponent } from './components/manufacturers-list/manufacturers-list.component';
import { ManufacturersFormComponent } from './components/manufacturers-form/manufacturers-form.component';
import { ManufacturersComponent } from './manufacturers.component';

const routes: Routes = [
  {
    path: '', component: ManufacturersComponent, children: [
      { path: '', component: ManufacturersListComponent },
      { path: 'create', component: ManufacturersFormComponent },
      { path: 'edit/:id', component: ManufacturersFormComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingManufacturersModule { }
