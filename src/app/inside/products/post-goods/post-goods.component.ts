import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { IProductMin } from '../product';
import { Observable } from 'rxjs';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilities } from 'src/app/utilities';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-post-goods',
  templateUrl: './post-goods.component.html',
  styleUrls: ['./post-goods.component.css']
})
export class PostGoodsComponent implements OnInit {
  form : FormGroup;
  errorMessage: string;
  productsAll: IProductMin[];
  products : IProductMin[];
  filteredProducts: Observable<IProductMin[]>[] = [];
  mode = 0;
  total = 0;

  constructor(private fb:FormBuilder, private productService:ProductService, private route:ActivatedRoute, private router: Router) { 

  }  

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        const goodReceiptCode = params.get('code');
        this.getGoodReceipt(goodReceiptCode);
      }
    )    

    this.loadProducts();
       
    this.form = this.fb.group({
      'postDate': new FormControl({value:  Date.now(), disabled: false}),
      'total': ['', [Validators.required]],
      'postBy':[""],
      'items': this.fb.array([this.buildItems()])
    });
    
    this.onChanges();     
  }
 

  getGoodReceipt(code:string){
    if(code === "0" || code === undefined|| code === null){
      this.mode = 1;
      return;
    }

     this.productService.get("goodReceipts", code)
      .subscribe(
        (goodReceipts) => this.displayReceipt(goodReceipts, code),
        error =>console.log("get order error" + error)       
      ); 
  }
  
  
  displayReceipt(receipt : any, created: string) : void{    
    if(receipt === undefined || this.mode === 1 ) return;
    
   /*
    this.orders = orders.dayOrders;
    this.todayOrder = this.orders.find(o=>o.createdDate == created);    

    if (this.form){
      this.form.reset();
      this.displayOrderItems();
    }

    this.form.patchValue({
      createdDate: this.todayOrder.createdDate,
      table: this.todayOrder.table,
      total: this.todayOrder.total,
      pax: this.todayOrder.pax,
      serviceCharge: this.todayOrder.serviceCharge,
      serviceChargeRate: this.todayOrder.serviceChargeRate,
      discount: this.todayOrder.discount,
      discountRate: this.todayOrder.discountRate,
      close: this.todayOrder.close
    }, {emitEvent:false})*/
  }

  displayItems(){
    while(this.items.length !==0){
      this.items.removeAt(0);
    }
    /*
    let items = this.todayOrder.items;
    for(var i =0; i < items.length; i ++){
      this.items.push(this.buildItemsWithValue([items[i].product, items[i].quantity, items[i].price, items[i].pack, items[i].cat]));
    }
    */
  }

  loadProducts() {  
    this.productService.getMin("productsMin", "all").subscribe((data : any) => {
      this.productsAll = data.products;
      this.products = this.productService.getProductsByCategory(this.productsAll, "beer");
      this.populateProducts(0);
    });
  }

  populateProducts(index: number):void {
    this.filteredProducts[index] = this.form.valueChanges.pipe(
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
      subTotal: this.total,
      cat: "beer"
    })
  }

  buildItemsWithValue(values) : FormGroup {
    return this.fb.group({
      product: values[0],
      quantity: [values[1], [Validators.required]],
      subTotal: 0,
      cat: values[4]
    })
  }

  get items(): FormArray{
    return <FormArray>this.form.get('items');
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
    this.form.valueChanges.subscribe(val =>{
      //this.updateOrder();     
    })
  }
  
  categorizeProducts(i: number, e){
    let cat = e.form.controls.items.controls[i].controls.cat.value;
    this.products = this.productService.getProductsByCategory(this.productsAll, cat);
    this.populateProducts(i);
    
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
    if(this.form.valid){
      this.updateProductCost();
      this.saveGoodReceipt();      
    } else {
      this.validateAll(this.form);
    }
  }

  updateProductCost(){
    console.log(this.form.value);
    let values = this.form.value;
    for(let i = 0; i<values.items.length; i++){
      delete values.items[i].product.price;
      delete values.items[i].product.pricesix;
      delete values.items[i].product.priceten;
    }

    if(this.mode === 1){
      let dateCreaated = Date.now();
    //  let post = {created: dateCreaated, }
    }
    console.log(values);
  }

  saveGoodReceipt(){  

  }

  resetItem(event, index : number){
    
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
