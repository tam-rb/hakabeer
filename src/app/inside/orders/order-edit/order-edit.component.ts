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

  constructor(private fb:FormBuilder, private orderService: OrderService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.orderForm = this.fb.group({
      table:['', [Validators.required]],
      pax: '',
      //promo: '',
      //items: this.fb.array([
      //  this.buildItems()
      //])
    });
  }

  buildItems() : FormGroup {
    return this.fb.group({
      productName: '',
      price: Number
    })
  }
  get items(): FormArray{
    return <FormArray>this.orderForm.get('items');
  }

  getErrorMessage(){}

}
