import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { IProduct } from '../product';
import { Metadata } from '../metadata';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productTexts = Metadata.productTexts;
  productForm : FormGroup;
  product : IProduct;
  
  constructor(private formBuilder  : FormBuilder, private productService: ProductService, private route: ActivatedRoute) {    
   }

  ngOnInit() {

    this.route.paramMap.subscribe(
      params => {
        const productCode = params.get('code');
        console.log(productCode);
        this.getProduct(productCode);

      }
    )    

    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      productCode: ['', [Validators.required, Validators.minLength(3)]],
      category: '',
      tags: '',
      availableDate: '',
      price: 0,
      description: '',
      starRating:'',
      imageUrl:'',
      inventory: 0
    })
  }

  getProduct(code:string){
    this.productService.getProduct(code)
      .subscribe(
        (product:IProduct) => this.onProductRetreived(product),
      )
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

  onSubmit() {
    this.productService.createProduct(this.productForm.value, this.productForm.controls["productCode"].value);
  }

}
