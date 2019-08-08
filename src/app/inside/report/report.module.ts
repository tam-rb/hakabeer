import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleComponent } from './sale/sale.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatTableModule, MatPaginatorModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { WarehouseComponent } from './warehouse/warehouse.component';

@NgModule({
  declarations: [SaleComponent, WarehouseComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    RouterModule.forChild([
      {path: '', component: SaleComponent},
      {path: 'wh', component: WarehouseComponent},
  ])
  ]
})
export class ReportModule { }
