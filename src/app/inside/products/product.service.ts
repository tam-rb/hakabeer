import { Injectable } from '@angular/core';
import { IProduct } from './product';
import {ProductsMock} from './products-mock';


@Injectable({
    providedIn: 'root'
})
export class ProductService{
    getProducts(): IProduct[]{
     return ProductsMock.getProducts();   
    }
}