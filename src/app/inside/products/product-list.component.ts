import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import { IProduct } from './product';
import { ProductService } from './product.service';

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
  products: IProduct[] = [];
  dataSource;
  displayedColumns: string[] = [];

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
    this.products = this.productService.getProducts();
    this.displayedColumns = Object.keys(this.products[0]);
    this.displayedColumns.push("action");
    this.dataSource = new MatTableDataSource(this.products);  
  }
}
