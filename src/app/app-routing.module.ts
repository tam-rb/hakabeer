import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './public/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'inside', loadChildren: './inside/inside.module#InsideModule'},
  {path: 'products', loadChildren: './inside/products/products.module#ProductsModule'},
  {path: 'orders', loadChildren: './inside/orders/orders.module#OrdersModule'},
  {path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 