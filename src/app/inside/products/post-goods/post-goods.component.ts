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
  receiptsAll;
  receipt;
  postDate : Date;

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
 
  checkTotal(){
    return false;
  }

  getGoodReceipt(code:string){
    if(code === "0" || code === undefined|| code === null){
      this.mode = 1;
    }

     this.productService.get("goodReceipts", "2019")
      .subscribe(
        (goodReceipts) => this.displayReceipt(goodReceipts, code),
        error =>console.log("get order error" + error)       
      ); 
  }
  
  
  displayReceipt(receiptDocument : any, created: string) : void{    
    if(receiptDocument === undefined ) return;    
   
    this.receiptsAll = receiptDocument.receipts;

    if(this.mode === 1) {
      return;
    }

    this.receipt = this.receiptsAll.find(r=>r.createdDate == created);    

    if (this.form){
      this.form.reset();
      this.displayItems();
    }
    this.postDate = new Date(this.receipt.postDate);
    this.form.patchValue({
      createdDate: this.receipt.createdDate,
      postDate: this.postDate,
      total: this.receipt.total,
      postBy: this.receipt.postBy,
    }, {emitEvent:false})
  }

  displayItems(){
    while(this.items.length !==0){
      this.items.removeAt(0);
    }
    
    let items = this.receipt.items;
    for(var i =0; i < items.length; i ++){
      this.items.push(this.buildItemsWithValue([items[i].product, items[i].quantity, items[i].subTotal, items[i].cat]));
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
    
  }
  
  categorizeProducts(i: number, e){
    let cat = e.form.controls.items.controls[i].controls.cat.value;
    this.products = this.productService.getProductsByCategory(this.productsAll, cat);
    this.populateProducts(i);
    
  }


  displayProductFn(product? :IProductMin) : string | undefined {
    return product? product.productName : undefined;
  }

  cancel(){
    this.router.navigate(['inside/orders']);
  }

  onSubmit() {   
    if(this.form.valid){
      this.refineReceiptData();
      this.updateReceipts();
      this.saveGoodReceipt();  
      this.updateProductCost();
      this.router.navigate(['inside/products']);

    } else {
      this.validateAll(this.form);
    }
  }

  refineReceiptData(){
    console.log(this.form.value);
    let values = this.form.value;
    for(let i = 0; i<values.items.length; i++){
      delete values.items[i].product.price;
      delete values.items[i].product.pricesix;
      delete values.items[i].product.priceten;
    }

    if(this.mode === 1){
      let dateCreaated = Date.now();
      this.receipt = values;
      this.receipt.createdDate = dateCreaated;
    }
    this.receipt.postDate = this.form.value.postDate.getTime();

    console.log(this.receipt);
  }

  updateProductCost(){
    for(let i = 0; i < this.receiptsAll.length; i ++){
      for(let ii = 0; ii < this.receiptsAll[i].items.length; ii ++){
        
      }
    }
  }

  updateReceipts(){
    let idx = this.canFind();
    if(this.receiptsAll === undefined || this.receiptsAll.length === 0 || idx < 0){
      if(this.receiptsAll === undefined){
        this.receiptsAll = [];
      }
      this.receiptsAll.push(this.receipt);
    }
    else{
      this.receiptsAll[idx] = this.receipt;
    }
  }

  canFind(){
    if(this.receiptsAll === undefined || this.receiptsAll.length === 0) return -1;
    return this.receiptsAll.findIndex(obj=>obj.createdDate === this.receipt.createdDate);

  }

  saveGoodReceipt(){  
    this.productService.set("goodReceipts", "2019", {docname: "2019", receipts: this.receiptsAll});
  }

  resetItem(event, index : number){
    return;
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
