import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './public/home/home.component';
import { UserRowComponent } from './public/user-row/user-row.component';
import { SideNavbarComponent } from './public/side-navbar/side-navbar.component';
import { MatSidenavModule } from '@angular/material';
import { MenuBarComponent } from './public/menu-bar/menu-bar.component';
import { ProductsComponent } from './public/products/products.component';
import { FooterComponent } from './public/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserRowComponent,
    SideNavbarComponent,
    MenuBarComponent,
    ProductsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule, 
    FlexLayoutModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
