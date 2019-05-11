import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatNativeDateModule, MatInputModule, MatAutocompleteModule, MatButtonToggleModule, MatToolbarModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderEditComponent } from './order-edit/order-edit.component';

@NgModule({
  declarations: [
    OrdersListComponent,
    OrderEditComponent
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
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatToolbarModule,
    ReactiveFormsModule,  
    RouterModule.forChild([
        {path: '', component: OrderEditComponent},
        {path: ':code', component: OrderEditComponent},
        {path: ':code/edit', component: OrderEditComponent}
    ])
  ]
})
export class OrdersModule { }
