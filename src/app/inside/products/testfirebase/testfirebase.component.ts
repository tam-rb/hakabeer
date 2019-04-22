import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-testfirebase',
  templateUrl: './testfirebase.component.html',
  styleUrls: ['./testfirebase.component.css']
})
export class TestfirebaseComponent implements OnInit {

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
  }

}
