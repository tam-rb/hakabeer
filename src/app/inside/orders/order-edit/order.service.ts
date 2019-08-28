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

    create(collectionName, data, code){
        return new Promise<any> ((resolve, reject) => {
        this.firestore
            .collection(collectionName).doc(code)
            .set(data)
            .then(res => {}, err => reject(console.log(err)));
    })

}

    getOrder(code:string):Observable<any>{        
        return this.firestore.collection("orders").doc<IOrder>(code).valueChanges();         
    }

    get(collection, docname):Observable<any>{
        return this.firestore.collection(collection).doc<any>(docname).valueChanges();  
    }

    getOrders(): Observable<IOrder[]> { 
        return this.firestore.collection('orders',
        ref => ref
        //.where("close", "==", false)
        .orderBy('createdDate', 'desc'))        
        .snapshotChanges()
        .pipe(map(snaps => {
            return snaps.map(snap=>{
                const data= snap.payload.doc.data() as IOrder;
                return data;
            })
        }));        
    }

    getOpenOrders(): Observable<IOrder[]> { 
        return this.firestore.collection(
            'orders',
                ref=>ref.where("close", "==", false)
                .orderBy('createdDate', 'desc'))        
        .snapshotChanges()
        .pipe(map(snaps => {
            return snaps.map(snap=>{
                const data= snap.payload.doc.data() as IOrder;
                return data;
            })
        }));        
    }

    getClosedOrders(): Observable<IOrder[]> { 
        return this.firestore.collection(
            'orders',
                ref=>ref.where("close", "==", true)
                .orderBy('createdDate', ))        
        .snapshotChanges()
        .pipe(map(snaps => {
            return snaps.map(snap=>{
                const data= snap.payload.doc.data() as IOrder;
                return data;
            })
        }));        
    }

} 