import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IProduct } from '../../products/product';
import { Metadata } from '../../products/metadata';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {

  productsCollection: AngularFirestoreCollection<IProduct>;  
  products: any;
  productTexts = Metadata.productTexts;
  dataSource ;
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator : MatPaginator;

  constructor(private router: Router, private productService: ProductService){
   }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private navigate(id) {
    this.router.navigate(['/products/', id, 'edit']);
  }

  private delete(id) {
    
  }

  ngOnInit(): void{     
    this.productService.getProducts().subscribe((data:IProduct[]) => {      
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.displayedColumns = Object.keys(this.productTexts);
      this.displayedColumns.push("action");
    });
  }

}
