import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../products/product.service';
import { OrderService } from '../../orders/order-edit/order.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IOrder } from '../../orders/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
  providers: [ProductService, OrderService]
})
export class WarehouseComponent implements OnInit {
  IPACount = 0;
  IPAPack6 = 0;
  IPAPack10 = 0;
  IPA = 0;
  orderCount;
  ordersCollection: AngularFirestoreCollection<IOrder>;
  
  constructor(private router: Router, private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getOrders().subscribe((data:IOrder[]) => {     
      this.parseOrderList(data);
    });
  }

  parseOrderList(data: IOrder[]) {
    let count = 0;
    this.orderCount = data.length;
    for (let i = 0; i < data.length; i ++){
      for(let itemIndex = 0; itemIndex < data[i].items.length; itemIndex ++){
        let orderItem = data[i].items[itemIndex] as any;
        if(orderItem.product.productCode === "B03" ){
          if(orderItem.pack === "six" ){
            count += 6;
            this.IPAPack6 += 1;
          } else if(orderItem.pack === "ten" ){
            count += 10;
            this.IPAPack10 += 1;
          }
          else {
            count += 1;
            this.IPA += 1;
          }
        }
      }
    }

  this.IPACount = count;
  }  
}
