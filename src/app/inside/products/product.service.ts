import { Injectable } from '@angular/core';
import { IProduct } from './product';
import {ProductsMock} from './products-mock';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root'
})
export class ProductService{
    constructor(private firestore: AngularFirestore){}

    createProduct(data, code){
        return new Promise<any> ((resolve, reject) => {
            this.firestore
                .collection("products").doc(code)
                .set(data)
                .then(res => {}, err => reject(console.log(err)));
        })
    }
    getProducts(): IProduct[]{
        return ProductsMock.getProducts();
    }

    gettamse(){
        return this.firestore.collection("products").snapshotChanges();   
    }
}