import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SharedServices} from "../../../../shared/services/shared-services";
import {Router} from "@angular/router";
import {errorResponse, userLogin} from "../../interface/auth-interface";
import {AuthServices} from "../../services/auth.services";
import {Subscription} from "rxjs";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  errorRender: errorResponse;
  aSub: Subscription;

  constructor (
    public sharedServices: SharedServices,
    public authServices: AuthServices,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ])
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }


  doLogin(user: userLogin) {
    this.sharedServices.loadingProgress(true);
    if(user) {
      this.aSub = this.authServices.login(user)
        .pipe(
          delay(1500)
        )
        .subscribe(
          response => {
            this.form.get('password').reset();
            this.sharedServices.loadingProgress(false);
            this.router.navigate([`/user/${response.userResponse.localId}`]);
            },
          error => {
            this.errorRender = error;
            console.log(error);
            this.form.get('password').reset();
            setTimeout(() => {
              this.sharedServices.loadingProgress(false);
            }, 1500);
          }
        )
    }
  }


  submitSignIn() {
    if(this.form.invalid) {
      return
    }
    else {
      const userLogin: userLogin = {
        email: this.form.get('email').value,
        password: this.form.get('password').value,
      };
      this.form.get('password').reset();
      this.doLogin(userLogin);
    }
  }

}
