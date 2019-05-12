import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './order.service';
import { IProduct } from '../../products/product';
import { ProductService } from '../../products/product.service';
import { Observable, from } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {
  orderForm : FormGroup;
  errorMessage: string;
  products : IProduct[];
  filteredProducts: Observable<IProduct[]>;

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

  private _filter(value): IProduct[] {
    if(this.products === undefined){ return; }
    if(value ===''){
      return this.products;
    }
    let  filterValue = '';

    if(typeof (value.items[0].product) ==='object'){
      filterValue = value.items[0].product.productName.toLowerCase();
    }
    else {
      filterValue =  value.items[0].product.toLowerCase();
    }
    return this.products.filter(option => option.productName.toLowerCase().includes(filterValue));
  }

  loadProducts() {  
    this.productService.getProducts().subscribe(data => {      
      this.populateProducts(data);
    });
  }

  populateProducts(data):void {
    this.products = data;
    //this.filteredProducts = from(data);
    this.filteredProducts = this.orderForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ); 
  }

  buildItems() : FormGroup {
    return this.fb.group({
      product: '',
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

  itemSelected(event, rowIndex){
    console.log(event.option.value);
    let itemPrice = event.option.value.price;
    this.orderForm.get("items." + rowIndex + ".price").patchValue(itemPrice);
  }

  displayProductFn(product? :IProduct) : string | undefined {
    console.log(product);
    return product? product.productName : undefined;
  }
}
