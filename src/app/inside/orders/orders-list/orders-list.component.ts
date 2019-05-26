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
    this.orderService.getOrders().subscribe((data:IOrder[]) => {      
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.displayedColumns = ["table", "total", "items", "action"]
      //this.displayedColumns.push("action");
    });
  }

}
