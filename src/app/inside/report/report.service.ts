import {Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { IOrder } from '../orders/order';

@Injectable({
    providedIn: 'root'
})
export class ReportService{
    constructor(private firestore: AngularFirestore){}

    getOrders(): Observable<IOrder[]> { 
        return this.firestore.collection('order')
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
            'order',
                ref=>ref.where("close", "==", false)
                .orderBy('table', ))        
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
            'order',
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