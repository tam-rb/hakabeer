import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import { IProduct } from './product';
import { ProductService } from './product.service';
import { Metadata } from "./metadata"
import { AngularFirestoreCollection } from '@angular/fire/firestore';

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
  productTexts = Metadata.productTexts;
  dataSource ;
  displayedColumns: string[] = [
    "productName",
    "productCode",
    "category",
    "flavor",
    "odour",
    "color",
    "abv",
    "ibu",
    "price",
    "description",
    "tags",    
    "imageUrl",
    "inventory"    
  ];

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort, {read:true}) sort: MatSort;

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
    this.dataSource.sort = this.sort;

      this.displayedColumns.push("action");
    });
  }
}
