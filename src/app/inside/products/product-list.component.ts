import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import { IProduct } from './product';
import { ProductService } from './product.service';
import { Metadata } from "./metadata"
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Utilities } from 'src/app/utilities';
import { DataService } from '../dataService';

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
  orders = [];
  masterReport: any;
  productTexts = Metadata.productTexts;
  dataSource ;
  productReport;
  saleReport = {total: 0, totalOrder: 0, fromdate: "", todate: ""}
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
    "quantity",
    "action" 
  ];

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort, {read:true}) sort: MatSort;

  constructor(private router: Router, private productService: ProductService, private dataService: DataService  ){
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
    this.loadProduct();
    this.loadMasterReport();
    
  }

  loadProduct(){
    this.productService.get("productsMin", "all").subscribe((data:any) => {  
      this.products = data.products;
    });
  }

  loadMasterReport(){
    this.productService.get("reports", "master").subscribe((data:any) => {  
      this.masterReport = data;
      if(!data){
        this.updateMasterReport("2019-07-01");
      } else if(data.lastUpdated < Utilities.getPreviousDay(new Date())){
        this.updateMasterReport(data.lastUpdated);
      }
    });
  }

  updateMasterReport(lastUpdated : string){
    if(lastUpdated === undefined){
      lastUpdated = "2019-07-01";
    }
    let todayString = (Utilities.getDate(new Date()) as any).dateOnlyString;
    this.dataService.getDocsRange("order", lastUpdated, todayString).subscribe((data:any)=>{
      this.combineOrderList(data);
    });
  }

  runReport(){  
    this.dataService.getDocByName("order", (Utilities.getDate(new Date()) as any).dateOnlyString).subscribe((data:any) => {  
      if(data){
        this.orders.concat(data.dayOrders);
      }
      this.generateSaleReport(); 
    });

  }

  generateSaleReport(){ 
    let total = 0;
      for(let i = 0; i < this.products.length; i ++){
      let count = 0;
        for (let orderIndex = 0; orderIndex < this.orders.length; orderIndex ++){
          total += this.orders[orderIndex].total;
          for(let itemIndex = 0; itemIndex < this.orders[orderIndex].items.length; itemIndex ++){
            let orderItem = this.orders[orderIndex].items[itemIndex] as any;
            if(orderItem.product.productCode === this.products[i].productCode){
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
  
        this.products[i].sold = count;
      }
      this.productReport = this.products;

      this.saleReport.totalOrder = this.orders.length;
      this.saleReport.todate = (Utilities.getDate(new Date()) as any).dateOnlyString;
      this.saleReport.fromdate = "";
      this.saleReport.total = total;
      this.saveMasterReport();

      this.dataSource = new MatTableDataSource(this.productReport);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;


  }

  saveMasterReport(){
    let predate = Utilities.getPreviousDay(new Date());
    this.masterReport = {
      lastUpdated: predate,
      productsReport: this.productReport,
      saleReport: this.saleReport
    }

    this.dataService.create("reports", this.masterReport, "master");
  }
 
  combineOrderList(ordersdata) {    
    for(let i = 1; i < ordersdata.length; i++){
      this.orders = this.orders.concat(ordersdata[i].dayOrders);
    }    
  }
}
