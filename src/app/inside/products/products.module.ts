import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatNativeDateModule, MatInputModule, MatMenuModule, MatToolbarModule, MatSidenavModule, MatListModule, MatButtonToggleModule, MatPaginatorModule, MatAutocompleteModule } from '@angular/material';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GoodsreceiptComponent } from './goodsreceipt/goodsreceipt.component';
import { PostGoodsComponent } from './post-goods/post-goods.component';


@NgModule({
  declarations: [
      ProductListComponent,
      ProductDetailComponent,
      ProductEditComponent,
      GoodsreceiptComponent,
      PostGoodsComponent
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
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    RouterModule.forChild([
        {path: '', component: ProductListComponent},
        {path: 'goods', component: GoodsreceiptComponent},
        {path: ':code/goods/post', component: PostGoodsComponent},
        {path: ':code', component: ProductDetailComponent},
        {path: ':code/edit', component: ProductEditComponent},
    ])
  ]
})
export class ProductsModule { }
