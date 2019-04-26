import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestfirebaseComponent } from './testfirebase/testfirebase.component';


@NgModule({
  declarations: [
      ProductListComponent,
      ProductDetailComponent,
      ProductEditComponent,
      TestfirebaseComponent      
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule.forChild([
        {path: '', component: ProductListComponent},
        {path: ':code', component: ProductDetailComponent},
        {path: ':code/edit', component: ProductEditComponent},
    ])
  ]
})
export class ProductsModule { }
