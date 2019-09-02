import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import { IProduct } from './product';
import { ProductService } from './product.service';
import { Metadata } from "./metadata"
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { OrderService } from '../orders/order-edit/order.service';
import { IOrder } from '../orders/order';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

/**
 * @title Table with filtering
 */
@Component({
  styleUrls: ['./product-list.component.css'],
  templateUrl: './product-list.component.html',
  providers: [ProductService]
})

export class ProductListComponent implements OnInit {
  productsCollection: AngularFirestoreCollection<IProduct>;  
  products: any;
  orders: any;
  productTexts = Metadata.productTexts;
  dataSource ;
  displayedColumns: string[] = [
    "productName",
    "productCode",
    "category",
   // "flavor",
    //"odour",
    //"color",
    //"abv",
    //"ibu",
    "cost",
    "price",
    //"description",
    //"tags",    
    //"imageUrl",
    "sold",
    "inventory",
    "action" 
  ];

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort, {read:true}) sort: MatSort;

  constructor(private router: Router, private productService: ProductService, private orderService: OrderService){
   }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private navigate(id) {
    this.router.navigate(['/products/', id, 'edit']);
  }

  private delete(id) {
    
  }

  ngOnInit(): void{    
    
  }

  showProducts(){
    this.productService.getMin("productsMin", "all").subscribe((data:any) => {  
      this.products = data.products;
      this.generateSaleReport(); 
    });

    /*
    this.orderService.getOrders().subscribe((saleData:IOrder[]) => {     
      this.orders = saleData;
      //this.generateSaleReport(); 
    });
    */
  }
  generateSaleReport(){
    this.orders = [];
    if(this.products === undefined || this.orders === undefined){
      return; 
    }
    let productData = this.parseOrderList(this.products, this.orders);
      this.dataSource = new MatTableDataSource(productData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }

  parseOrderList(products, orders) : IProduct[] {
    for(let i = 0; i < products.length; i ++){
    let count = 0;
      for (let orderIndex = 0; orderIndex < orders.length; orderIndex ++){
        for(let itemIndex = 0; itemIndex < orders[orderIndex].items.length; itemIndex ++){
          let orderItem = orders[orderIndex].items[itemIndex] as any;
          if(orderItem.product.productCode === products[i].productCode){
            if(orderItem.pack === "six"){
              count += 6 * orderItem.quantity;
            }
            else if (orderItem.pack === "ten"){
              count += 10 * orderItem.quantity;
            }
            else{
              count += orderItem.quantity;
            }
          }
        }
      }

      products[i].sold = count;
    }
      return products;
  }
}
