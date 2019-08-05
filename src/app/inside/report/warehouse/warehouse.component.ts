import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../products/product.service';
import { OrderService } from '../../orders/order-edit/order.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
  providers: [ProductService, OrderService]
})
export class WarehouseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
