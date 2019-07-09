import {Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { IOrder } from '../order';

@Injectable({
    providedIn: 'root'
})
export class OrderService{
    constructor(private firestore: AngularFirestore){}

    createOrder(data, code){
            return new Promise<any> ((resolve, reject) => {
            this.firestore
                .collection("orders").doc(code)
                .set(data)
                .then(res => {}, err => reject(console.log(err)));
        })

    }

    getOrder(code:string):Observable<IOrder>{
        if(code === "0"){
        }
        
        return this.firestore.collection("orders").doc<IOrder>(code).valueChanges();  
        
    }

    getOrders(): Observable<IOrder[]> { 
        return this.firestore.collection<IOrder>('orders', ref =>{
            return ref
                .orderBy('table', 'desc')
        }).valueChanges();
    }

} 