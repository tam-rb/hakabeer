import { Injectable } from '@angular/core';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;
  isValidLoggedIn: boolean;

  get isLoggedIn(): boolean {
    return true;
    return this.isValidLoggedIn;
    return !!this.currentUser;
  }
  constructor() { }

  login(loginInfo){
    if(loginInfo.email === 'mr.tamnt@gmail.com' && 
        loginInfo.password === 'abc'){
          this.isValidLoggedIn = true;
        }
        else{
          this.isValidLoggedIn = false;
        }
  }
}
