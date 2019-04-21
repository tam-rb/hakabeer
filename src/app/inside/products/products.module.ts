import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { MatTableModule, MatButtonModule, MatIconModule, MatCardModule } from '@angular/material';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';


@NgModule({
  declarations: [
      ProductListComponent,
      ProductDetailComponent,
      ProductEditComponent      
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule.forChild([
        {path: '', component: ProductListComponent},
        {path: ':id', component: ProductDetailComponent},
        {path: ':id/edit', component: ProductEditComponent}
    ])
  ]
})
export class ProductsModule { }
