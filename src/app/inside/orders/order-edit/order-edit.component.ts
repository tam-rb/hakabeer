import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from './order.service';
import { IProduct } from '../../products/product';
import { ProductService } from '../../products/product.service';
import { Observable, from } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IOrder } from '../order';
import * as printJS from 'print-js';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {
  orderForm : FormGroup;
  errorMessage: string;
  productsAll: IProduct[];
  products : IProduct[];
  filteredProducts: Observable<IProduct[]>;
  order: any;
  DISCOUNT_RATE = 0;
  discountList = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5];

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
      'createdDate': new FormControl({value:  Date.now(), disabled: false}),
      'table':['', [Validators.required]],
      'pax': '',      
      'total': ['', [Validators.required]],
      'discount': 0,
      'discountRate': new FormControl(this.DISCOUNT_RATE),
      'close': false,
      'items': this.fb.array([this.buildItems()])
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
        error =>console.log("get order error" + error)       
      ); 
  }
  
  displayOrder(order : IOrder) : void{
    console.log(order);
    if(order === undefined) return;
   
    this.order = order;    

    if (this.orderForm){
      this.orderForm.reset();
      this.displayOrderItems();
    }

    this.orderForm.patchValue({
      createdDate: this.order.createdDate,
      table: this.order.table,
      total: this.order.total,
      pax: this.order.pax,
      discount: this.order.discount,
      discountRate: this.order.discountRate,
      close: this.order.close
    }, {emitEvent:false})
  }

  displayOrderItems(){
    while(this.items.length !==0){
      this.items.removeAt(0);
    }
    let items = this.order.items;
    for(var i =0; i < items.length; i ++){
      this.items.push(this.buildItemsWithValue([items[i].product, items[i].quantity, items[i].price, items[i].pack]));
    }
    
  }

  loadProducts() {  
    this.productService.getProducts().subscribe(data => {
      this.productsAll = data;
      this.products = this.productService.getProductsByCategory(this.productsAll, "beer");
      this.populateProducts(data);
    });
  }

  populateProducts(data):void {
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
      pack: "",
      cat: "beer"
    })
  }

  buildItemsWithValue(values) : FormGroup {
    return this.fb.group({
      product: values[0],
      quantity: [values[1], [Validators.required]],
      price: [values[2], [Validators.required]],
      pack: values[3]
    })
  }

  get items(): FormArray{
    return <FormArray>this.orderForm.get('items');
  }

  addItem(){
    this.refreshItems();
    this.items.push(this.buildItems());
  }
  
  refreshItems(){
    this.products = this.productService.getProductsByCategory(this.productsAll, "beer");
  }
  removeItem(i : number){
    this.products = this.productsAll;
    this.items.removeAt(i);
  }

  getErrorMessage(){}

  onChanges(): void {
    this.orderForm.valueChanges.subscribe(val =>{
      this.updateOrderItem();     
    })
  }
  
  categorizeProducts(i: number, e){
    let cat = e.orderForm.controls.items.controls[i].controls.cat.value;
    this.products = this.productService.getProductsByCategory(this.productsAll, cat);
    this.populateProducts(this.products);
    
  }
  updateOrderItem(){
    let data = this.orderForm.value;
    if (data.createdDate === null) return;
    let total = 0;
    let num = 0;
    for (let i = 0; i < data.items.length; i ++){
      if(data.items[i].product===''){
        continue;
      }
      data.items[i].price = +data.items[i].product["price" +data.items[i].pack];

    
      num += +data.items[i]['quantity'];
      total += +data.items[i]['quantity']*(+data.items[i]['price']);
      
    }

    data.discount = total * data.discountRate;

    total = total - data.discount;    

    data.quantity = num;
    data.total = Math.round(total/1000) * 1000;

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
    if(this.orderForm.valid){
      this.orderService.createOrder(this.orderForm.value, this.orderForm.value.createdDate.toString());
      this.router.navigate(['inside/orders']);
    } else {
      this.validateAll(this.orderForm);
    }
  }

  printReceiptJSON(){  
    let p = '<p style="font-family:Impact; font-size: 14px; padding-left:-12px">';  
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

  printReceiptHTML(){  
    this.onSubmit();
    if(!this.orderForm.valid){ return; }
    const style = `
    td {
      font-family: Merchant Copy;
      text-transform: uppercase;
      font-size: 10px;
    }

    th{
      font-size: 11px;
    }

    .quantity{
      padding-right: 5px;
    }
      .header {
        text-align: center;
        
        font-size: 9px;
        font-style: bold;
      }

      .header1 {
        text-align: center;
        
        font-size: 14px;
        font-style: bold;
      }
    `;
    let printhtml =`
    <table width='100%'><tr><th class='header1' colspan='3'>HAKABEER STATION</th></tr>
      <tr><td colspan='3' class='header'>CS31 Prosper Plaza</td></tr>
      <tr><td colspan='3' class='header'>www.Hakabeerstation.com</td></tr>
      <tr><td colspan='3' class='header'>0938 2000 20</td></tr>
      <tr><td colspan='3' ></td><tr>
      <tr><td colspan='3' ></td><tr>
      <tr><td colspan='3' ></td><tr>
      <tr><td colspan='3'><table>
      <tr><td>Date</td><td>` + this.getDateString(this.orderForm.value.createdDate) + `</td><tr>
      <tr><td>Table</td><td>` + this.orderForm.value.table + `</td><tr></table></td></tr>
      <tr><td colspan='3' ><hr /></td><tr>
      <tr><td colspan='3' ></td><tr>
      <tr><td colspan='3' >Details</td><tr>`;

    let data = this.orderForm.value;
    
    for (let i = 0; i < data.items.length; i ++){
      if(data.items[i].product===''){
        continue;
      }
      let row = "<tr><td>" + data.items[i].product.productName + "</td>";
        row += "<td class='quantity'>" + data.items[i].quantity + "</td>",
        row += "<td>" + data.items[i].price * data.items[i].quantity + "</td></tr>"
        
        printhtml += row;
    }

    if(this.orderForm.value.discount > 0) {
    printhtml += `<tr><td colspan='3' ></td><tr>
                  <tr><td colspan='3' ><hr /></td><tr>
                  <tr><td>Discount </td><td></td><td>` + 100* this.orderForm.value.discountRate + `%</td><tr>
                  <tr><td>Discount amount</td><td></td><td>` + this.orderForm.value.discount + `</td><tr>`  
    }
    
    printhtml += `<tr><td colspan='3' ><hr /></td><tr>
    <tr><td>Total</td><td></td><td>` + this.orderForm.value.total + `</td><tr>
    <tr><td colspan='3' ></td><tr>
    <tr><td colspan='3' ></td><tr>
    <tr><td colspan='3' ></td><tr>
    <tr><td colspan='3' ></td><tr>
    <tr><td colspan='3' class='header'>Thank you</td><tr>

    <tr><td colspan='3' class='header'>hope to see you again</td><tr>

    </table>`;

      printJS({
        printable: printhtml,
        type: 'raw-html',
        style: style,
        scanStyles: false
      })
    }
  

  getDateString(createdDate){
    var dateString = '';
    var billDate;
    if(createdDate === undefined || createdDate === ''){
       billDate = new Date();
    } else {
      billDate = new Date(createdDate);
    }
    
      let dd = billDate.getDate();
      let mm = billDate.getMonth() +1;
      let yyyy = billDate.getFullYear();
      let h = '' + billDate.getHours();
      let m = '' + billDate.getMinutes();
      let s = '' + billDate.getSeconds();
      
      let D = '' + dd;
      let M = ''+ mm;
      let Y = ''+ yyyy;

      if(dd < 10){
        D = '0' + D;
      }

      if(mm < 10){
        M = '0' + M;
      }
      dateString =  Y + '-' + M + '-' + D + ' ' + h + ":" + m;
    

    return dateString;
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
