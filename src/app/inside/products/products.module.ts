import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { MatTableModule } from '@angular/material';


@NgModule({
  declarations: [
      ProductListComponent      
  ],
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule.forChild([
        {path: '', component: ProductListComponent}
    ])
  ]
})
export class ProductsModule { }
