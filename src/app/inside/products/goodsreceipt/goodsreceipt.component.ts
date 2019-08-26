import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../orders/order-edit/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder } from '../../orders/order';
import { IProduct } from '../product';
import { Utilities } from 'src/app/utilities';

@Component({
  selector: 'app-goodsreceipt',
  templateUrl: './goodsreceipt.component.html',
  styleUrls: ['./goodsreceipt.component.css']
})
export class GoodsreceiptComponent implements OnInit {

  orderAll : IOrder[];
  productAll : IProduct[];

  constructor(private orderService: OrderService, private route:ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  mergeProduct()
  {


  }

  mergeOrder(){
    this.orderService.getOrders().subscribe((data:IOrder[]) => {      
      this.mergeData(data);
    });
  }

  mergeData(data){
    let order7 = [];
    let order8 = [];
    let orderelse = [];
    for (let i = 0; i < data.length; i ++){
      let m = Utilities.getMonth(data[i].createdDate);

      if(m === "7"){
        order7.push(data[i]);
      } else if(m == "8"){
        order8.push(data[i]);
      }
      else{
        orderelse.push(data[i]);
      }
    }

    this.orderService.create("order", {"orders": order7}, "2019-07");
    this.orderService.create("order", {"orders": order8}, "2019-08");
    this.orderService.create("order", {"orders": orderelse}, "2019-06");
  }
}
