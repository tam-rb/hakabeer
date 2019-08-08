import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductService } from '../product.service';
import { IProduct } from '../product';
import { Metadata } from '../metadata';
import { ActivatedRoute, Router } from '@angular/router';
import {BeersData} from '../beersData';
import {CoffeeData} from '../coffeeData';
import {FoodData} from '../foodData';
import { OutsideMenu } from '../outsideMenuData';

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
  cats = ["beer", "food", "coffee", "soft", "outside"];
  productIDs = [];
  
  constructor(private formBuilder  : FormBuilder, private productService: ProductService, private route: ActivatedRoute, private router: Router) {    
   }

  ngOnInit() {

    this.route.paramMap.subscribe(
      params => {
        const productCode = params.get('code');
        if(productCode === "0"){
          this.generateProductID();
        }
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
      cost: 0,
      price: 0,
      pricesix: 0,
      priceten: 0,
      description: '',
      starRating:'',
      imageUrl:'',
      inventory: 0
    })
  }

  generateProductID(){
    let ids = ["B01", "C01", "J01", "S01", "F01", "O01"];
    this.productService.getProducts().subscribe((data:IProduct[]) => {       
      for(let i=0; i <data.length; i++){
        if(data[i].category === "beer"){
          if(data[i].productCode.toUpperCase() > ids[0]){
            ids[0] = data[i].productCode;
          }
          
        } 
        if(data[i].category === "coffee"){
          if(data[i].productCode > ids[1]){
            ids[1] = data[i].productCode;
          }          
        } 

        if(data[i].category === "juice"){
          if(data[i].productCode > ids[2]){
            ids[2] = data[i].productCode;
          }          
        }

        if(data[i].category === "soft"){
          if(data[i].productCode > ids[3]){
            ids[3] = data[i].productCode;
          }          
        }

        if(data[i].category === "food"){
          if(data[i].productCode > ids[4]){
            ids[4] = data[i].productCode;
          }          
        }

        if(data[i].category === "outside"){
          if(data[i].productCode > ids[5]){
            ids[5] = data[i].productCode;
          }          
        }
      } 
      
      this.productIDs = this.idIncrement(ids);

    });
    
  }
  
  idIncrement(ids : string []) : string []{
    for(let i = 0; i < ids.length; i ++){
      let num = parseInt(ids[i].substr(1));
      num = num + 1;
      if(num < 10){
        ids[i] = ids[i].substr(0, 1) + "0" + num;
      } else {
        ids[i] = ids[i].substr(0,1) + num;
      }
    }
    return ids;
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
      cost: this.product.cost,
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

  createAllProducts(){
    let data = BeersData.items;
    data = data.concat(CoffeeData.items, FoodData.items, OutsideMenu.items);
    for(var i = 0; i < data.length; i ++){
      this.productService.createProduct(data[i], data[i].productCode);
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
