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

export interface MasterReport{
  products;
  sale;
  lastUpdated;
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
  masterReport: MasterReport;
  productTexts = Metadata.productTexts;
  dataSource ;
  saleReport ;
  today = (Utilities.getDate(new Date()) as any).dateOnlyString;
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
    //this.loadMasterReport();
    //this.loadTodayOrders();

  }

  loadProduct(){
    this.productService.get("productsMin", "all").subscribe((data:any) => {  
      this.products = data.products;
      this.displayReport(this.products);
    });
  }

  loadMasterReport(){
    this.productService.get("reports", "master").subscribe((data:any) => {       
      if(data){
        this.masterReport = data;
      }
      else{
        this.masterReport = {sale: null, products: [], lastUpdated: null}
      }
    });
  }

  runReport(){  
    //this.updateProductList();
    let lastUpdated = "2019-07-01";
    /*if(this.masterReport && this.masterReport.lastUpdated){
        lastUpdated = this.masterReport.lastUpdated;
    } 
    */
    let yesterday = Utilities.getPreviousDay(new Date());
    if(lastUpdated < yesterday){
      this.loadDeltaOrders(lastUpdated, yesterday);
    }

    /*
    else if(this.masterReport.lastUpdated < Utilities.getPreviousDay(new Date())){
      this.updateMasterReport(this.masterReport.lastUpdated);
    }*/


    /*this.dataService.getDocByName("order", (Utilities.getDate(new Date()) as any).dateOnlyString).subscribe((data:any) => {  
      if(data){
        this.orders.concat(data.dayOrders);
      }
      //this.generateSaleReport(); 
    });
*/
  }

  loadDeltaOrders(fromDate:string, todate: string){
    this.dataService.getDocsRange("order", fromDate, todate).subscribe((data:any)=>{
      let deltaorders = this.combineOrderList(data);
      this.generateDeltaReport(deltaorders);
      //save report

      this.loadTodayOrders(deltaorders);
      //this.displayReport(this.products);
    });
  }

  displayReport(data){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  generateDeltaReport(deltaOrders: any){
   // this.updateProductList();

    if (deltaOrders){
      this.generateReport(deltaOrders);
    }
     /*
    let fromdate = new Date(this.masterReport.lastUpdated);
    fromdate.setDate(fromdate.getDate() +1);
    let yesterday = (Utilities.getHakaBusinessDay(new Date()) as any);

    this.dataService.getDocsRange("order", (Utilities.getDate(fromdate) as any).dateOnlyString, yesterday).subscribe((data:any)=>{
      this.combineOrderList(data);
      this.dataService.getDocByName("order",this.today).subscribe((order: any)=>{
        if()
        this.refreshReport();
      })
    });
    */
  }

  loadTodayOrders(deltaOrders){
    let today = (Utilities.getDate(new Date()) as any).dateOnlyString;
    this.dataService.getDocByName("order", today).subscribe((order: any)=>{
      if(order){
        this.addTodayOrder(deltaOrders, order.dayOrders);
      }
    });
  }
  
  updateProductList(){
    if(this.masterReport){
      let prods = this.masterReport.products.length;
      for(let i = 0; i < this.products.length; i++){
        for(let j =0; j <prods; j ++){
          if(this.masterReport.products[j].productCode === this.products[i].productCode){
            break;
          }
        }
        this.masterReport.products.push(this.products[i]);
      }
    }
  }

  addTodayOrder(deltaOrders, orders){
    deltaOrders = deltaOrders.concat(orders);
   this.generateReport(deltaOrders);
   // this.generateSaleReport(); 
  }

  generateReport(orders){ 
    let total = 0;
    let prods = [];
      for(let i = 0; i < this.products.length; i ++){
      let count = 0;
      let p = this.products[i];
        for (let orderIndex = 0; orderIndex < orders.length; orderIndex ++){
          total += orders[orderIndex].total;
          for(let itemIndex = 0; itemIndex < orders[orderIndex].items.length; itemIndex ++){
            let orderItem = orders[orderIndex].items[itemIndex] as any;
            if(orderItem.product.productCode === p.productCode){
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

        if(isNaN(p.sold)){
          p.sold = 0;
        }
        p.sold = count;

        prods.push(p);
      }

      this.displayReport(prods);

      /*
      this.saleReport = {
        totalOrder: this.orders.length, 
        todate : (Utilities.getDate(new Date()) as any).dateOnlyString,
        fromdate: "",
        total:total
      }
        */    
      //this.saveMasterReport();

      //console.log(this.masterReport.products);

  }

  saveMasterReport(){
    if(!this.masterReport) return;
    this.masterReport.sale.totalOrder += this.saleReport.totalOrder;
    this.masterReport.sale.total += this.saleReport.total;
    this.masterReport.sale.todate = this.saleReport.todate;
    this.masterReport.sale.fromdate  =  "";
    
    let predate = Utilities.getPreviousDay(new Date());
    this.masterReport = {
      lastUpdated: predate,
      products: [],
      sale: this.saleReport
    }

    this.dataService.create("reports", this.masterReport, "master");
  }
 
  combineOrderList(ordersdata) {   
    let deltaOrders = []; 
    for(let i = 1; i < ordersdata.length; i++){
      deltaOrders = deltaOrders.concat(ordersdata[i].dayOrders);
    } 
    return deltaOrders;
  }
}
