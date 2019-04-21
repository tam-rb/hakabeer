import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { UserRowComponent } from './shared/user-row/user-row.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'products', loadChildren: './inside/products/products.module#ProductsModule'},
  //{path: 'product', component: UserRowComponent, outlet:'userrow'}, 
  {path: 'orders', loadChildren: './inside/orders/orders.module#OrdersModule'},
  {path: '', component: UserRowComponent, outlet:'userrow'},
  {path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 