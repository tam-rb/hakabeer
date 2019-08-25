import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { OrderService } from '../../orders/order-edit/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder } from '../../orders/order';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  dataSource = null;
  productCode;
  productName;
  summary = {packSix: 0, packTen: 0, single: 0, soldCount: 0, orderCount: 0};
  displayedColumns = ["date", "table"];


  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort, {read:true}) sort: MatSort;
  
  constructor(private productService: ProductService, private orderService: OrderService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {    
    this.route.paramMap.subscribe(
      params => {
        this.productCode = params.get('code');        
      }
    );
    
    this.orderService.getOrders().subscribe((data:IOrder[]) => {     
      let filteredOrders = this.parseOrderList(data, this.productCode);
      this.dataSource = new MatTableDataSource(filteredOrders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
    
  }

  parseOrderList(data: IOrder[], productCode: string) : IOrder[] {
    let filteredOrders = [];
    let count = 0;
    let packSix = 0;
    let packTen = 0;
    let single = 0;
    //this.orderCount = data.length;
    for (let i = 0; i < data.length; i ++){
      let hasProduct = false;
      for(let itemIndex = 0; itemIndex < data[i].items.length; itemIndex ++){
        let orderItem = data[i].items[itemIndex] as any;
        if(orderItem.product.productCode === productCode ){
          this.productName = orderItem.product.productName;
          hasProduct = true;
          if(orderItem.pack === "six" ){
            count += 6 * orderItem.quantity;
            packSix += 1;
          } else if(orderItem.pack === "ten" ){
            count += 10 * orderItem.quantity;
            packTen += 1;
          }
          else {
            count += orderItem.quantity;
            single += orderItem.quantity;
          }
        }
      }

      if(hasProduct){
        filteredOrders.push(data[i]);
      }      
    }

    this.summary.packSix = packSix;
      this.summary.packTen = packTen;
      this.summary.single = single;
      this.summary.soldCount = count;
      this.summary.orderCount = filteredOrders.length;
    
    return filteredOrders;

  //this.IPACount = count;
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
