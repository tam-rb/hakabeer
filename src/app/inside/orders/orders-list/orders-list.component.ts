import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { OrderService } from '../order-edit/order.service';
import { IOrder } from '../order';
import { Utilities } from 'src/app/utilities';

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
    let today = Utilities.getDate(Date.now()) as any;    
    this.orderService.get("order", today.dateOnlyString).subscribe((data: any) => { 
      if(data !== undefined && data.dayOrders !== undefined) {   
        this.dataSource = new MatTableDataSource(data.dayOrders);
        this.dataSource.paginator = this.paginator;
        this.displayedColumns = ["date", "table", "total", "action"];
      }
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

  getDateString(timestamp){
    return Utilities.getDateString(timestamp);
  }
}
