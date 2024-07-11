import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductMasterComponent } from './product-master/product-master.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'product_master' },
  { path: 'product_master', component: ProductMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
