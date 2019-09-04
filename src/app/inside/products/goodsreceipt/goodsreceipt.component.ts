import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../orders/order-edit/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder } from '../../orders/order';
import { IProduct } from '../product';
import { Utilities } from 'src/app/utilities';
import { ProductService } from '../product.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-goodsreceipt',
  templateUrl: './goodsreceipt.component.html',
  styleUrls: ['./goodsreceipt.component.css']
})
export class GoodsreceiptComponent implements OnInit {

  orderAll: IOrder[];
  productAll: IProduct[];
  moved = false;
  order30: any;
  order31: any;
  allOrders: any;
  allReceiptPosts: any;
  dataSource;

  displayedColumns: string[] = [
    "postDate",
    "total",
    "postBy"
  ];

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort, {read:true}) sort: MatSort;
  
  constructor(private orderService: OrderService, private productService: ProductService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.productService.get("goodReceipts", "2019").subscribe((data:any) => {   
      this.allReceiptPosts = data.receipts;
      this.dataSource = new MatTableDataSource(this.allReceiptPosts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    /*
    this.productService.get("order", "2019-08-30").subscribe((torders:any) => {   
      this.order30 = torders.dayOrders;
    });

    this.productService.get("order", "2019-08-31").subscribe((o:any) => {   
      this.order31 = o.dayOrders;
    });

    

   this.orderService.getOrders().subscribe((o:any) => {   
    console.log(0);
  });
*/

    this.orderService.getDocs("order").subscribe((orders: any) => {
      this.allOrders = orders;
    })
  }

  move() {
    //this.productService.get("order", "2019-08-29").subscribe((orders => this.copyto(orders, "2019-08-28")));
  }

  fixData() {

  }

  updateDocName() {
    for(let i =0; i < this.allOrders.length; i++){
      this.orderService.create("order", this.allOrders[i], this.allOrders[i].docname);
    }
  }
  copyto(orders: any, docname: string) {
    let toMove = orders.dayOrders.filter(order => order.table == "99");

    this.productService.get("order", docname).subscribe((torders: any) => {
      torders.dayOrders = [torders.dayOrders[0]];
      for (let i = 0; i < toMove.length; i++) {
        torders.dayOrders.push(toMove[i]);
      }

      if (this.moved === false) {
        this.orderService.create("order", torders, docname);
        this.moved = true;
      }
    });


  }
  mergeProduct() {
    this.productService.getProducts().subscribe((data: IProduct[]) => {
      this.mergeProductData(data);
    });
  }

  mergeProductData(data: IProduct[]) {
    let prodMinimal = [];
    for (let i = 0; i < data.length; i++) {
      prodMinimal.push({
        productCode: data[i].productCode,
        productName: data[i].productName,
        category: data[i].category,
        price: data[i].price,
        pricesix: data[i].pricesix,
        priceten: data[i].priceten
      })
    }

    this.orderService.create("productsMin", { products: prodMinimal }, "all");
  }

  mergeDataTest(items) {
    //items = [{"category":"blog","id":"586ba9f3a36b129f1336ed38","content":"foo, bar!"},{"category":"blog","id":"586ba9f3a36b129f1336ed3c","content":"hello, world!"},{"category":"music","id":"586ba9a6dfjb129f1332ldab","content":"wow, shamwow!"}];
    var result = items.reduce(function (accumulator, item) {
      var cdate = Utilities.getDate(item.createdDate) as any;
      var current = accumulator.hash[cdate.dateOnlyString];

      if (!current) {
        current = accumulator.hash[cdate.dateOnlyString] = {
          saleDate: cdate.dateOnlyString,
          items: []
        };

        accumulator.arr.push(current);
      }

      current.items.push(item);

      return accumulator;
    }, { hash: {}, arr: [] }).arr;

    console.log(result);
    return result;
  }

  mergeOrder() {
    /*
    this.orderService.getOrders().subscribe((data:IOrder[]) => {      
      let groupedOrders = this.mergeDataTest(data);
      this.createGroupedOrder(groupedOrders);
    }); 
    */
  }

  createGroupedOrder(orders: [any]) {
    for (let i = 0; i < orders.length; i++) {
      this.orderService.create("order", { dayOrders: orders[i].items }, orders[i].saleDate);
    }
  }
}
