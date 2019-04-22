import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { IProduct } from '../product';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm : FormGroup;
  product : IProduct;
  constructor(private formBuilder  : FormBuilder) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      productId: '',
      productName: '',
      productCode: '',
      category: '',
      tags: '',
      releaseDate: '',
      price: 0,
      description: '',
      starRating:'',
      imageUrl:'',
      stock: 0
    })
  }

}
