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
  orderList: any;
  orderListRight: any;
  orderListSpecial: any;
  dataSource ;
  displayedColumns: string[] = [];
  tableLeft = [1, 2, 3, 4, 5, 6, 7, 8];
  tableRight =[9, 10, 11, 12, 13, 14, 15, 16]
  tableOutside = [];
  takeAway = ['take away'];


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
    let dateObj = Utilities.getDate(Date.now()) as any;
    let orderDocname = this.getDocName(dateObj);
    this.initTableList();

    this.orderService.getDocByName("order", orderDocname).subscribe((data: any) => { 
      if(data !== undefined && data.dayOrders !== undefined) {
        this.parseTable( data.dayOrders );   
        this.dataSource = new MatTableDataSource(this.filterOrder(data.dayOrders));
        this.dataSource.paginator = this.paginator;
        this.displayedColumns = ["date", "table", "total", "action"];
      }
    });
  }

  initTableList(){
    this.orderList = [];
    for (let i=1; i <= 8; i ++){
      let tb = {tblNo: i, od: undefined}
      this.orderList.push(tb);
    }

    this.orderListRight = [];
    for (let i=9; i <= 16; i ++){
      let tb = {tblNo: i, od: undefined}
      this.orderListRight.push(tb);
    }

    this.orderListSpecial = [];
  }

  parseTable (ods){
    for (let i=1; i <= 16; i ++){
      ods.forEach(element => {
        if(element.close == false){
        if(element.table == i ){
          if(i < 9){
          this.orderList[i-1].od = element;
          }
          else if (i < 17){
            this.orderListRight[i-9].od = element;
          }
        }
      }
      
      });
    }

    ods.forEach(element => {
      if(element.table == 99 && element.close == false){
        this.orderListSpecial.push({tblNo: 99, od: element});
      }
    });
  }
  
  getDocName(dateObj){
    let dateString = dateObj.dateOnlyString;
    let h = parseInt(dateObj.hour); 
    if(h < 6 && h >= 0)
    {
      let today = new Date();
      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      dateString = (Utilities.getDate(yesterday) as any).dateOnlyString;

    }
    return dateString;
  }

  filterOrder(orders): IOrder[]{
    return orders.filter(order=>order.close === false);
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
