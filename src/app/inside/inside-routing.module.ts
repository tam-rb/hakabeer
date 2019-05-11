import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent,
    children: [
      { path: 'products', loadChildren: './products/products.module#ProductsModule'},
      { path: 'orders', loadChildren: './orders/orders.module#OrdersModule'}
    ]
  },     
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsideRoutingModule { }
