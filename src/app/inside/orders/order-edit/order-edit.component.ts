import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './order.service';
import { IProduct } from '../../products/product';
import { ProductService } from '../../products/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {
  orderForm : FormGroup;
  errorMessage: string;
  products : IProduct[];
  filteredProducts: IProduct[];

  constructor(private fb:FormBuilder, private productService:ProductService, private orderService: OrderService, private route:ActivatedRoute) { 

  }

  ngOnInit() {
    this.loadProducts();

    this.orderForm = this.fb.group({
      table:['', [Validators.required]],
      pax: '',
      //promo: '',
      total: '',
      items: this.fb.array([this.buildItems()])
    });
    
    this.onChanges();
  }

  loadProducts() {  
    this.productService.getProducts().subscribe(data => {      
      this.populateProducts(data);
    });
  }

  populateProducts(data):void {
    this.products = data;
    this.filteredProducts = data;
  }

  buildItems() : FormGroup {
    return this.fb.group({
      productName: '',
      quantity: '',
      price: ''
    })
  }

  get items(): FormArray{
    return <FormArray>this.orderForm.get('items');
  }

  addItem(){
    this.items.push(this.buildItems());
  }

  getErrorMessage(){}

  onChanges(): void {
    this.orderForm.valueChanges.subscribe(val =>{
     this.orderForm.patchValue({
       total: this.totalBill()
     }, { emitEvent: false })
    })
  }

  totalBill(): number {
    let total = 0;
    for(let item of this.items.value){
      total += +item['quantity']*(+item['price']);
    }
    return total;
  }

  itemSelected(productCode){
    this.displayItemPrice(productCode);
  }

  displayItemPrice(productCode){
    console.log(productCode);

  }

}
