import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../products/product.service';
import { OrderService } from '../../orders/order-edit/order.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IOrder } from '../../orders/order';
import {IProduct} from '../../products/product';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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

  reportForm: FormGroup;

  products: IProduct[] = [];
  filteredProducts: Observable<IProduct[]>;

  ordersCollection: AngularFirestoreCollection<IOrder>;
  
  constructor(private fb: FormBuilder, private router: Router, private orderService: OrderService, private productService : ProductService) { }

  ngOnInit() {
    this.reportForm = this.fb.group({
      product: new FormControl()
    });
    
    /*
    this.productService.getProducts().subscribe((data: IProduct[]) =>{
      this.products = data;
      this.filteredProducts = this.reportForm.controls["product"].valueChanges
        .pipe(
          startWith(''),
          map(value ==> this._filter(value))
        );
    })

    this.orderService.getOrders().subscribe((data:IOrder[]) => {     
      this.parseOrderList(data);
    });

    */
  }

  private _filter(value: string): IProduct[] {
    const filterValue = value.toLowerCase();

    return this.products.filter(p => p.productName.toLowerCase().includes(filterValue));
  }

  parseOrderList(data: IOrder[]) {
    let count = 0;
    this.orderCount = data.length;
    for (let i = 0; i < data.length; i ++){
      for(let itemIndex = 0; itemIndex < data[i].items.length; itemIndex ++){
        let orderItem = data[i].items[itemIndex] as any;
        if(orderItem.product.productCode === "B03" ){
          if(orderItem.pack === "six" ){
            count += 6 * orderItem.quantity;
            this.IPAPack6 += 1;
          } else if(orderItem.pack === "ten" ){
            count += 10 + orderItem.quantity;
            this.IPAPack10 += 1;
          }
          else {
            count += orderItem.quantity;
            this.IPA += orderItem.quantity;
          }
        }
      }
    }

  this.IPACount = count;
  }  
}
