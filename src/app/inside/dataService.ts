import {Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService{
    constructor(private firestore: AngularFirestore){}

    create(collectionName, data, code){
        return new Promise<any> ((resolve, reject) => {
        this.firestore
            .collection(collectionName).doc(code)
            .set(data)
            .then(res => {}, err => reject(console.log(err)));
    })
} 

    getDocByName(collection, docname):Observable<any>{
        return this.firestore.collection(collection).doc<any>(docname).valueChanges();  
    }

    getDocs(collectionName) : Observable<any>{
        return this.firestore.collection(collectionName).snapshotChanges() .pipe(map(snaps => {
            return snaps.map(snap=>{
                const data= snap.payload.doc.data() as any;
                const id = snap.payload.doc.id;            
                return {docname: id, dayOrders: data.dayOrders};
            })
        }));  

    }
    
    getDocsRange(collectionName: string, from:string, to:string): Observable<any[]> { 
        return this.firestore.collection(collectionName,
        ref => ref
        .orderBy('docname').startAt(from).endAt(to))        
        .snapshotChanges()
        .pipe(map(snaps => {
            return snaps.map(snap=>{
                const data= snap.payload.doc.data();
                return data;
            })
        }));        
    }
} 