import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error = null;

  constructor(private authSvc: AuthService,
    private router: Router) { }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    this.error = null;

    const email = authForm.value.nm_email;
    const password = authForm.value['nm_password'];

    if (authForm.valid) {
      this.isLoading = true;
    }

    let authObs: Observable<AuthResponseData>;

    if (!this.isLoginMode && authForm.valid) {
      console.log("Signing up");
      //Signup
      authObs = this.authSvc.signup(email, password);
    }
    else if (authForm.valid) {
      //Login
      authObs = this.authSvc.login(email, password)
    }

    authObs.subscribe(
      response => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(["/recipes"]);
      },
      errMsg => {
        this.error = errMsg;
        this.isLoading = false;
      }
    );
    authForm.reset();
  }
}
