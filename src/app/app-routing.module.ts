import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { AuthGuard } from './user/auth.guard';
import { LoginComponent } from './user/login/login.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'login', component:LoginComponent
  },
  {
    path: 'inside',
    canLoad: [AuthGuard],
    loadChildren: './inside/inside.module#InsideModule'
  },  
  {
    path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 