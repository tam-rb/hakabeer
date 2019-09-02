import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from './order.service';
import { IProduct, IProductMin } from '../../products/product';
import { ProductService } from '../../products/product.service';
import { Observable, from } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IOrder } from '../order';
import * as printJS from 'print-js';
import { Utilities } from 'src/app/utilities';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {
  orderForm : FormGroup;
  errorMessage: string;
  productsAll: IProductMin[];
  products : IProductMin[];
  filteredProducts: Observable<IProductMin[]>[] = [];
  todayOrder: any;
  orders: any;
  orderDocname : string;
  DISCOUNT_RATE = 0;
  mode = 0;
  
  
  discountList = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5];
  serviceChargeRate = 0;
  serviceChargeList = [0, 0.1];

  constructor(private fb:FormBuilder, private productService:ProductService, private orderService: OrderService, private route:ActivatedRoute, private router: Router) { 

  }  

  ngOnInit() {
    this.defaultServiceCharge();

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
      'serviceCharge': 0,
      'serviceChargeRate': new FormControl(this.serviceChargeRate),
      'close': false,
      'items': this.fb.array([this.buildItems()])
    });
    
    this.onChanges();     
  }

  defaultServiceCharge(){
    let today = new Date();
    
    if(today.getDay() === 6 && today.getHours() > 7 && today.getHours() < 10){
      this.serviceChargeRate = 0.1;
    }
  }

  getOrder(code:string){
    if(code === "0" || code === undefined) {
      this.mode = 1;
      code = Date.now() + "";
    }
    let dateObj = Utilities.getDate(code) as any;
    this.orderDocname = this.getDocName(dateObj);
     this.orderService.getDocByName("order", this.orderDocname)
      .subscribe(
        (orders) => this.displayOrder(orders, code),
        error =>console.log("get order error" + error)       
      ); 
  }
  
  getDocName(dateObj){
    let dateString = dateObj.dateOnlyString;
    let h = parseInt(dateObj.hour); 
    if(h < 6 && h >= 0)
    {
      let today = new Date();
      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      dateString = (Utilities.getDate(yesterday) as any).dateOnlyString;

    }
    return dateString;
  }

  displayOrder(orders : any, created: string) : void{
    if(orders === undefined ) return;

    if(this.mode === 1) {
      this.orders = orders.dayOrders;
      return;
    }
   
    this.orders = orders.dayOrders;
    this.todayOrder = this.orders.find(o=>o.createdDate == created);    

    if (this.orderForm){
      this.orderForm.reset();
      this.displayOrderItems();
    }

    this.orderForm.patchValue({
      createdDate: this.todayOrder.createdDate,
      table: this.todayOrder.table,
      total: this.todayOrder.total,
      pax: this.todayOrder.pax,
      serviceCharge: this.todayOrder.serviceCharge,
      serviceChargeRate: this.todayOrder.serviceChargeRate,
      discount: this.todayOrder.discount,
      discountRate: this.todayOrder.discountRate,
      close: this.todayOrder.close
    }, {emitEvent:false})
  }

  displayOrderItems(){
    while(this.items.length !==0){
      this.items.removeAt(0);
    }
    let items = this.todayOrder.items;
    for(var i =0; i < items.length; i ++){
      this.items.push(this.buildItemsWithValue([items[i].product, items[i].quantity, items[i].price, items[i].pack, items[i].cat]));
    }
    
  }

  loadProducts() {  
    this.productService.getMin("productsMin", "all").subscribe((data : any) => {
      this.productsAll = data.products;
      this.products = this.productService.getProductsByCategory(this.productsAll, "beer");
      this.populateProducts(0);
    });
  }

  populateProducts(index: number):void {
    this.filteredProducts[index] = this.orderForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, index))
    ); 
  }

  private _filter(value, index): IProductMin[] {
    if(this.products === undefined){ return; }
    if(value ===''){
      return this.products;
    }
    let  filterValue = '';
    if(index >= value.items.length){
      return;
    }
    if(typeof (value.items[index].product) ==='object'){
      filterValue = value.items[index].product.productName.toLowerCase();
    }
    else {
      filterValue =  value.items[index].product.toLowerCase();
    }
    return this.products.filter(option => option.productName.toLowerCase().startsWith(filterValue));
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
      pack: values[3],
      cat: values[4]
    })
  }

  get items(): FormArray{
    return <FormArray>this.orderForm.get('items');
  }

  addItem(){
    this.refreshItems();
    this.populateProducts(this.items.length);
    this.items.push(this.buildItems());
  }
  
  refreshItems(){
    this.products = this.productService.getProductsByCategory(this.productsAll, "beer");
  }
  removeItem(i : number){
    
    this.items.removeAt(i);
    this.products = this.productsAll;
    this.populateProducts(i);
    this.filteredProducts.slice(i,1);
  }

  getErrorMessage(){}

  onChanges(): void {
    this.orderForm.valueChanges.subscribe(val =>{
      this.updateOrder();     
    })
  }
  
  categorizeProducts(i: number, e){
    let cat = e.orderForm.controls.items.controls[i].controls.cat.value;
    this.products = this.productService.getProductsByCategory(this.productsAll, cat);
    this.populateProducts(i);
    
  }
  updateOrder(){
    let data = this.orderForm.value;
    let patchData = {
      'discount': 0,
      'serviceCharge': 0,
      'total' : 0
    }
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
    patchData.serviceCharge = total * data.serviceChargeRate;
    total = total + patchData.serviceCharge;
    patchData.discount = total * data.discountRate;
    total = total - patchData.discount;    

    patchData.total = Math.round(total/1000) * 1000;
    
    this.orderForm.patchValue(patchData, {emitEvent:false});
    this.todayOrder = this.orderForm.value;
    //let dateObj = Utilities.getDate(this.todayOrder.createdDate) as any;
    //this.orderDocname = dateObj.dateOnlyString;
  }

  
 

  productSelected(event, rowIndex){     
    let pack = "price" + this.orderForm.get("items." + rowIndex + ".pack").value;
    let itemPrice = event.option.value[pack];
    this.orderForm.get("items." + rowIndex + ".price").patchValue(itemPrice, {emitEvent:false});  
    this.updateOrder();
  }

  packSelected(event, rowIndex){
    let pack = "price" + event.value;
    let iprice = this.orderForm.get("items." + rowIndex) as any; 
    let itemPrice = iprice.controls.product.value[pack];
    this.orderForm.get("items." + rowIndex + ".price").patchValue(itemPrice, {emitEvent:false}); 
    this.updateOrder();
  }

  updateRowValues(rowIndex : number){
    
  }

  displayProductFn(product? :IProductMin) : string | undefined {
    return product? product.productName : undefined;
  }

  cancel(){
    this.router.navigate(['inside/orders']);
  }

  onSubmit() {
    this.updateOrder();
    this.updateDayOrder();
    if(this.orderForm.valid){
      this.orderService.create("order", {docname: this.orderDocname, dayOrders: this.orders}, this.orderDocname);
      this.router.navigate(['inside/orders']);
    } else {
      this.validateAll(this.orderForm);
    }
  }

  updateDayOrder(){
    let idx = this.canFindOrder();
    if(this.orders === undefined || this.orders.length === 0 || idx < 0){
      if(this.orders === undefined){
        this.orders = [];
      }
      this.orders.push(this.todayOrder);
    }
    else{
      this.orders[idx] = this.todayOrder;
    }
  }

  canFindOrder(){
    if(this.orders === undefined || this.orders.length === 0) return -1;
    return this.orders.findIndex(obj=>obj.createdDate === this.todayOrder.createdDate);

  }
  resetItem(event, index : number){
    console.log(event);
    let row = this.orderForm.get("items." + index) as any; 
    row.controls.product.patchValue('', {emitEvent:false});
    let cat = row.controls.cat.value;
    this.products = this.productService.getProductsByCategory(this.productsAll, cat);
    this.populateProducts(index);
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
      let row = "<tr><td>" + data.items[i].product.productName + " " +  this.getPackString(data.items[i].pack) + "</td>";
        row += "<td class='quantity'>" + data.items[i].quantity +  "</td>",
        row += "<td>" + data.items[i].price * data.items[i].quantity + "</td></tr>"
        
        printhtml += row;
    }

    if(this.orderForm.value.serviceCharge > 0) {
      printhtml += `<tr><td colspan='3' ></td><tr>
                    <tr><td colspan='3' ><hr /></td><tr>
                    <tr><td>Service charge </td><td></td><td>` + 100* this.orderForm.value.serviceChargeRate + `%</td><tr>
                    <tr><td>Service charge amount</td><td></td><td>` + this.orderForm.value.serviceCharge + `</td><tr>`  
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
  
  getPackString(pack){
    if(pack === "six") {
      return "6";
    } 
    
    if(pack === "ten"){
      return "10";
    }

    return "";   
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
