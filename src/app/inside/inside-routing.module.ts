import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: './orders/orders.module#OrdersModule'},
  {path: 'orders', loadChildren: './orders/orders.module#OrdersModule'},
  {path: 'products', loadChildren: './products/products.module#ProductsModule'},
  {path: '**', loadChildren: './orders/orders.module#OrdersModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsideRoutingModule { }
