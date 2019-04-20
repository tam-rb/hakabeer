import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { ProductListComponent } from './inside/products/product-list.component';
import { UserRowComponent } from './shared/user-row/user-row.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'product', component: ProductListComponent},
  {path: 'product', component: UserRowComponent, outlet:'userrow'},  
  {path: '', component: UserRowComponent, outlet:'userrow'},
  {path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 