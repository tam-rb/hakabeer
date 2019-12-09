import { Injectable } from '@angular/core';
import {User} from 'firebase';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser: User;
  isValidLoggedIn: boolean;

  get isLoggedIn(): boolean {
    return true;
    return this.isValidLoggedIn;
    return !!this.currentUser;
  }
  constructor(private authService: AuthService) { }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
 
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  } 
 
  signOut(): void {
    this.authService.signOut();
  }

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
