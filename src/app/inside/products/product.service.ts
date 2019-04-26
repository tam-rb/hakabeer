import { Injectable } from '@angular/core';
import { IProduct } from './product';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


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

    getProducts(){ 

        return this.firestore.collection("products").snapshotChanges().pipe(map(products =>{
            return products.map(p=>{
                const data = p.payload.doc.data() as IProduct;
                const id = p.payload.doc.id;
                return data;
            })
        }));        
    }

    getProduct(code:string):Observable<IProduct>{
        if(code === "0"){
            return of(this.initProduct());
        }
        return this.firestore.collection("products").snapshotChanges();   
    }
}