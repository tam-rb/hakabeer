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

    getProducts(): Observable<IProduct[]> { 
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
            //return of(this.initProduct());
        }
        return this.firestore.collection("products").doc<IProduct>(code).valueChanges();  
    }

    getProductsByCategory(data: IProduct[], cat:string){        
        let result = [];

        if(cat === "beer"){
            for(let i=0; i <data.length; i ++){
                if(data[i].category === cat){
                    result.push(data[i]);
                }
            }
        } else if (cat === "others"){
            for(let i=0; i <data.length; i ++){
                if(data[i].category !== "beer" && data[i].category !== "outside"){
                    result.push(data[i]);
                }
            }
        } else if (cat === "outside") {
            for(let i=0; i <data.length; i ++){
                if(data[i].category === cat){
                    result.push(data[i]);
                }
            }
        }
        

        return result;
    }

}