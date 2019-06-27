import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from './order.service';
import { IProduct } from '../../products/product';
import { ProductService } from '../../products/product.service';
import { Observable, from } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IOrder } from '../order';
import * as printJS from 'print-js';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

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
  order: IOrder;

  constructor(private fb:FormBuilder, private productService:ProductService, private orderService: OrderService, private route:ActivatedRoute, private router: Router) { 

  }

  ngOnInit() {

    this.route.paramMap.subscribe(
      params => {
        const orderCode = params.get('code');
        this.getOrder(orderCode);
      }
    )    

    this.loadProducts();
       
    this.orderForm = this.fb.group({
      table:['', [Validators.required]],
      pax: '',      
      total: ['', [Validators.required]],
      discount: 0,
      discountRate: 0,
      close: false,
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

  getOrder(code:string){
    if(code === "0" || code === undefined) {
      return;
    }

     this.orderService.getOrder(code)
      .subscribe(
        (order) => this.displayOrder(order),
        error =>this.errorMessage = <any>error        
      ); 
  }
  
  displayOrder(order : IOrder) : void{
    if (this.orderForm){
      this.orderForm.reset();
    }

    /* this.order = order;

    this.orderForm.patchValue({
      
    }); */
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
      quantity: [1, [Validators.required]],
      price: [0, [Validators.required]],
      pack: ""
    })
  }

  get items(): FormArray{
    return <FormArray>this.orderForm.get('items');
  }

  addItem(){
    this.items.push(this.buildItems());
  }
  
  removeItem(i : number){
    this.items.removeAt(i);
  }

  getErrorMessage(){}

  onChanges(): void {
    this.orderForm.valueChanges.subscribe(val =>{
      this.updateOrderItem();     
    })
  }

  updateOrderItem(){
    let data = this.orderForm.value;
    let total = 0;
    let num = 0;
    for (let i = 0; i < data.items.length; i ++){
      if(data.items[i].product===''){
        continue;
      }
      data.items[i].price = +data.items[i].product["price" +data.items[i].pack];

    
      num += +data.items[i]['quantity'];
      total += +data.items[i]['quantity']*(+data.items[i]['price']);
      
    data.discount = (total * data.discountRate).toFixed(2);
    total = total - data.discount;
    }

    data.quantity = num;
    data.total = total;

    this.orderForm.patchValue(data, {emitEvent:false});
  }

  
  /*

  itemSelected(event, rowIndex){
    console.log(event.option.value);
    let pack = "price" + this.orderForm.get("items." + rowIndex + ".pack");
    let itemPrice = event.option.value[pack];
    this.orderForm.get("items." + rowIndex + ".price").patchValue(itemPrice);
  }
*/
  displayProductFn(product? :IProduct) : string | undefined {
    console.log(product);
    return product? product.productName : undefined;
  }

  cancel(){
    this.router.navigate(['inside/orders']);
  }

  onSubmit() {
    let createdDate = this.getDateString(this.orderForm["createdDate"]);
    this.orderService.createOrder(this.orderForm.value, createdDate);
  }

  printReceipt(){  
    let p = '<p style="font-family:Old Standard TT; font-size: 14px; padding-left:-12px">';  
    if(!this.orderForm.value.active){
      let header='<div style="text-align: center; left:-15px;"><H4>HAKABEER STATION</H4>'
      header += p + 'CS31 Prosper Plaza</p>';
      header += p + '22/14 Phan Van Hon, Dist. 12, HCMc</p>';
      header += p + 'www.Hakabeerstation.com</p>';
      header += p + '0938 2000 20</p> ';
      header += '<p>';
      header += '<hr /> </div>';
      header += 'Table ' + this.orderForm.value.table;
    let printable = [];

    let data = this.orderForm.value;
    
    for (let i = 0; i < data.items.length; i ++){
      if(data.items[i].product===''){
        continue;
      }
      let row = {
        "item":data.items[i].product.productName,
        "qty":data.items[i].quantity,
        "cost": data.items[i].price * data.items[i].quantity
      };
      
      printable.push(row);       
    }

    printable.push ({
      "item": "Thành Tiền",
      "qty": "",
      "cost": data.total
    })

      printJS({
        printable: printable,
        properties: [
          {field: 'item', displayName: ''},
          {field: 'qty', displayName: ''},
          {field: 'cost', displayName: ''}
        ],
        type: 'json',
        gridHeaderStyle: 'color :black; border: 0;',
        gridStyle: 'border: 0; font-size:8px',
        header: header
      })
    }
  }

  getDateString(createdDate){
    if(createdDate === undefined){
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() +1;
      let yyyy = today.getFullYear();
      let D = '' + dd;
      let M = ''+ mm;
      let Y = ''+ yyyy;

      if(dd < 10){
        D = '0' + D;
      }

      if(mm < 10){
        M = '0' + M;
      }
      return Y + '-' + M + '-' + D;
    }
    
    return createdDate;
  }

}
