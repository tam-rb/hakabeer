import { Injectable } from '@angular/core';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;
  isValidLoggedIn: boolean;

  get isLoggedIn(): boolean {
    return this.isValidLoggedIn;
    return !!this.currentUser;
  }
  constructor() { }

  login(loginInfo){
    if((loginInfo.email === 'mr.tamnt@gmail.com' || loginInfo.email === 'staff@hakabeerstation.com') && 
        loginInfo.password === 'hakabeer@12#$'){
          this.isValidLoggedIn = true;
        }
        else{
          this.isValidLoggedIn = false;
        }
  }
}
