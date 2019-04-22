import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
      productName: ['', [Validators.required, Validators.minLength(3)]],
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

  get productName() {
    return this.productForm.get('productName');
  }

  getErrorMessage(){
    let errs = this.productForm.get('productName').errors;
    if(errs.required){
      return 'Please enter product name';
    }
    
    if (errs.minlength){
      return 'Product name is too short'
    }
  }

}
