import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';


import { UserRowComponent } from './shared/user-row/user-row.component';
import { HomeComponent } from './public/home/home.component';
import { environment } from 'src/environments/environment';
import { MatButtonModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonToggleGroup, MatButtonToggleGroupMultiple, MatButtonToggleModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    UserRowComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule, 
    FlexLayoutModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonToggleModule
      
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
