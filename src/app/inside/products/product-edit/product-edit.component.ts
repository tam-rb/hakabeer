import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductService } from '../product.service';
import { IProduct } from '../product';
import { Metadata } from '../metadata';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productTexts = Metadata.productTexts;
  productForm : FormGroup;
  product : IProduct;
  errorMessage : string;
  
  constructor(private formBuilder  : FormBuilder, private productService: ProductService, private route: ActivatedRoute, private router: Router) {    
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
      flavor: '',
      odour: '',
      color: '',
      abv: '',
      ibu: '',
      tags: '',
      availableDate: '',
      price: 0,
      pricesix: 0,
      priceten: 0,
      description: '',
      starRating:'',
      imageUrl:'',
      inventory: 0
    })
  }

  getProduct(code:string){
    if(code === "0") {
      return;
    }
    
    this.productService.getProduct(code)
      .subscribe(
        (product:IProduct) => this.displayProduct(product),
        error =>this.errorMessage = <any>error        
      );
  }
  
  displayProduct(product : IProduct) : void{
    if (this.productForm){
      this.productForm.reset();
    }

    this.product = product;

    this.productForm.patchValue({
      productName: this.product.productName,
      productCode: this.product.productCode,
      category:this.product.category,
      flavor: this.product.flavor,
      odour: this.product.odour,
      color: this.product.color,
      abv: this.product.abv,
      ibu: this.product.ibu,
      tags:this.product.tags,
      availableDate:this.product.availableDate,
      price:this.product.price,
      pricesix: this.product.pricesix,
      priceten: this.product.priceten,
      description:this.product.description,
      starRating:this.product.starRating,
      imageUrl:this.product.imageUrl,
      inventory:this.product.inventory
    });
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
    if(this.productForm.valid){
      this.productService.createProduct(this.productForm.value, this.productForm.controls["productCode"].value);
      this.router.navigate(['/inside/products']);
    } else {
      this.validateAll(this.productForm);
    }    
  }

  validateAll(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);            
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAll(control);            
      }
    });
  }

}
