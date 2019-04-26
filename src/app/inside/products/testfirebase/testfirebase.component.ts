import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';

export interface tamse {
  name : string;
  love: string
}

@Component({
  selector: 'app-testfirebase',
  templateUrl: './testfirebase.component.html',
  styleUrls: ['./testfirebase.component.css']
})
export class TestfirebaseComponent implements OnInit {
  tamsee;
  constructor(private productService : ProductService) { }

  ngOnInit() {    
     //this.productService.createProduct(data)
      //this.productService.gettamse().subscribe(data => (this.tamsee =data ));
  
  }
}
