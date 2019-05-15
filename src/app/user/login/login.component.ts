import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  
  constructor(private fb:FormBuilder, private authService : AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]      
    });
    
  }

  onSubmit(){
    this.authService.login(this.loginForm.value);
    if (this.authService.isLoggedIn){
      this.router.navigate(['inside/orders']);
    }    
  }

}
