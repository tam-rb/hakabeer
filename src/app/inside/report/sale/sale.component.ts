import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IOrder } from '../../orders/order';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { OrderService } from '../../orders/order-edit/order.service';
import { Utilities } from 'src/app/utilities';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  ordersCollection: AngularFirestoreCollection<IOrder>;
  orders: any;
  dataSource;
  displayedColumns: string[] = [];
  ordersCount = 0;
  ordersSum = 0;

  reportForm: FormGroup


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fb: FormBuilder, private router: Router, private orderService: OrderService) {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private navigate(id) {
    this.router.navigate(['/orders/', id, 'edit']);
  }

  private delete(id) {

  }

  onSubmit() {
    let from = this.reportForm.value.fromDate;
    let to = this.reportForm.value.toDate;
    let fromName = Utilities.getDate(from.getTime()) as any;
    let toName = Utilities.getDate(to.getTime()) as any;
    
    this.orderService.getDocsRange("order", fromName.dateOnlyString,  toName.dateOnlyString).subscribe((data: any) => {
      if(data !== undefined && data[0] !== undefined){
      let allOrders = data[0].dayOrders;
      for(let i = 1; i < data.length; i++){
        allOrders = allOrders.concat(data[i].dayOrders);
      }
    
      if (allOrders !== undefined) {
        allOrders =  this.filterData(allOrders);
        this.dataSource = new MatTableDataSource(allOrders);
        this.dataSource.paginator = this.paginator;
        this.displayedColumns = ["createdDate", "date", "table", "total", "state", "action"];
      }
    }
    });

  }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      fromDate: new FormControl(new Date()),
      toDate: new FormControl(new Date())
    })

  }

  filterData(data: IOrder[]) {
    this.ordersCount = 0;
    this.ordersSum = 0;
    for (var i = 0; i < data.length; i++) {     
      this.ordersCount++;
      this.ordersSum += data[i].total;
    }

    return data;
  }

  parseState(isClose) {
    if (isClose) {
      return "Đã thanh toán";
    }
    else {
      return "Chưa thanh toán";
    }

  }
  getDateString(createdDate) {
    var dateString = '';
    var billDate;
    if (createdDate === undefined || createdDate === '') {
      billDate = new Date();
    } else {
      billDate = new Date(createdDate);
    }

    let dd = billDate.getDate();
    let mm = billDate.getMonth() + 1;
    let yyyy = billDate.getFullYear();
    let h = '' + billDate.getHours();
    let m = '' + billDate.getMinutes();
    let s = '' + billDate.getSeconds();

    let D = '' + dd;
    let M = '' + mm;
    let Y = '' + yyyy;

    if (dd < 10) {
      D = '0' + D;
    }

    if (mm < 10) {
      M = '0' + M;
    }
    dateString = Y + '-' + M + '-' + D + ' ' + h + ":" + m;


    return dateString;
  }


}
