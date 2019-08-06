import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { OrderService } from '../order-edit/order.service';
import { IOrder } from '../order';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {

  ordersCollection: AngularFirestoreCollection<IOrder>;  
  orders: any;
  dataSource ;
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator : MatPaginator;

  constructor(private router: Router, private orderService: OrderService){
   }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private navigate(id) {
    this.router.navigate(['/orders/', id, 'edit']);
  }

  private delete(id) {
    
  }

  ngOnInit(): void{     
    this.orderService.getOpenOrders().subscribe((data:IOrder[]) => {     
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.displayedColumns = ["date", "table", "total", "action"];
      //this.displayedColumns.push("action");
    });
  }

  parseState(isClose){
    if(isClose){
      return "Đã thanh toán";
    }
    else{
      return "Chưa thanh toán";
    }

  }

  parseItems(items){
    let itemList = "<ol>";
    for(var i = 0; i < items.length; i ++){
      itemList += "<li>" + items[i].product.productName + "</li>";
    }

    itemList += "</ol>";
    return itemList;
  }
  getDateString(createdDate){
    var dateString = '';
    var billDate;
    if(createdDate === undefined || createdDate === ''){
       billDate = new Date();
    } else {
      billDate = new Date(createdDate);
    }
    
      let dd = billDate.getDate();
      let mm = billDate.getMonth() +1;
      let yyyy = billDate.getFullYear();
      let h = '' + billDate.getHours();
      let m = '' + billDate.getMinutes();
      let s = '' + billDate.getSeconds();
      
      let D = '' + dd;
      let M = ''+ mm;
      let Y = ''+ yyyy;

      if(dd < 10){
        D = '0' + D;
      }

      if(mm < 10){
        M = '0' + M;
      }
      dateString =  Y + '-' + M + '-' + D + ' ' + h + ":" + m;
    

    return dateString;
    }

}
