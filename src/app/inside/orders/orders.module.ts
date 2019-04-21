import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [OrdersListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: OrdersListComponent}
    ])
  ]
})
export class OrdersModule { }
