import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleComponent } from './sale/sale.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatTableModule, MatPaginatorModule, MatDatepickerModule, MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SaleComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {path: '', component: SaleComponent},
  ])
  ]
})
export class ReportModule { }
