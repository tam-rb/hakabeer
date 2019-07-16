import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IOrder } from '../../orders/order';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  ordersCollection: AngularFirestoreCollection<IOrder>;  
  orders: any;
  dataSource ;
  displayedColumns: string[] = [];
  ordersCount = 0;
  ordersSum = 0;

  reportForm: FormGroup


  @ViewChild(MatPaginator) paginator : MatPaginator;

  constructor(private fb: FormBuilder,  private router: Router, private reportService: ReportService){
   }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private navigate(id) {
    this.router.navigate(['/orders/', id, 'edit']);
  }

  private delete(id) {
    
  }

  onSubmit(){
    let from = this.reportForm.value.fromDate;
    let fd = from.getDate();
    let fm = from.getMonth();
    let fy = from.getFullYear();

    let to = this.reportForm.value.toDate;
    let td = to.getDate();
    let tm = to.getMonth();
    let ty = to.getFullYear();
    
    from = new Date(fy, fm, fd, 0, 0, 0);
    to = new Date(ty, tm, td, 23, 59, 59);   

    let fromstamp =  from.getTime();
    let tostamp = to.getTime();

    this.reportService.getOrders().subscribe((data:IOrder[]) => {      
      this.dataSource = new MatTableDataSource(this.filterData(data, fromstamp, tostamp));
      this.dataSource.paginator = this.paginator;
      this.displayedColumns = ["createdDate", "date", "table", "total", "state", "action"];
    });
    
  }

  ngOnInit(): void{   
    
    this.reportForm = this.fb.group({
      fromDate: new FormControl(new Date()),
      toDate: new FormControl(new Date())
    })
    
  }

  filterData(data: IOrder[], from, to){
    var returnData =[];
    this.ordersCount = 0;
    this.ordersSum = 0;
    for(var i = 0; i < data.length; i ++){
      if(data[i].createdDate > from && data[i].createdDate < to){
        returnData.push(data[i]);
        this.ordersCount ++;
        this.ordersSum += data[i].total;
      }
    }

    return returnData;
  }

  parseState(isClose){
    if(isClose){
      return "Đã thanh toán";
    }
    else{
      return "Chưa thanh toán";
    }

  }
  getDateString(createdDate){
    var dateString = '';
    var billDate;
    if(createdDate === undefined || createdDate === ''){
       billDate = new Date();
    } else {
      billDate = new Date(createdDate);
    }
    
      let dd = billDate.getDate();
      let mm = billDate.getMonth() +1;
      let yyyy = billDate.getFullYear();
      let h = '' + billDate.getHours();
      let m = '' + billDate.getMinutes();
      let s = '' + billDate.getSeconds();
      
      let D = '' + dd;
      let M = ''+ mm;
      let Y = ''+ yyyy;

      if(dd < 10){
        D = '0' + D;
      }

      if(mm < 10){
        M = '0' + M;
      }
      dateString =  Y + '-' + M + '-' + D + ' ' + h + ":" + m;
    

    return dateString;
    }


}
