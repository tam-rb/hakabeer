import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {
  orderForm : FormGroup;
  errorMessage: string

  constructor(private fb:FormBuilder, private orderService: OrderService, private route:ActivatedRoute) { 

  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      table:['', [Validators.required]],
      pax: '',
      //promo: '',
      total: '',
      items: this.fb.array([
        this.buildItems()
      ])
    });
    this.onChanges();

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
}
