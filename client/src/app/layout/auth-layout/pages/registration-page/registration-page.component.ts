import {Component, OnDestroy, OnInit} from '@angular/core';
import {delay} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthServices} from "../../services/auth.services";
import {errorResponse, userRegister} from "../../interface/auth-interface";
import {Router} from "@angular/router";
import {SharedServices} from "../../../../shared/services/shared-services";
import {RegisterValidators} from "./validators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css'],
  providers: [AuthServices]
})
export class RegistrationPageComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  errorRender: errorResponse;
  aSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public authServices: AuthServices,
    public sharedServices: SharedServices,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
        name: [null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
        ]],
        country: [null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ]],
        gender: [null, [
          Validators.required,
        ]],
        email: [null, [
          Validators.required,
          Validators.email,
        ]],
        password: [null, [
          Validators.required,
          RegisterValidators.passwordValidator
        ]],
        confirmPassword: [null, [
          Validators.required,
        ]],
      },
      { validator: RegisterValidators.matchingPasswords}
    );
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  doRegistration(user: userRegister) {
    this.sharedServices.loadingProgress(true);
    if(user) {
      this.aSub = this.authServices.register(user)
        .pipe(
          delay(1500)
        )
        .subscribe(
          (response) => {
            if(response) {
              this.registerForm.get('password').reset();
              this.sharedServices.loadingProgress(false);
              this.router.navigate([`/sign-in`]);
            }
          },
          error => {
            this.errorRender = error;
            this.registerForm.get('password').reset();
            setTimeout(() => {
              this.sharedServices.loadingProgress(false);
            }, 1500);
          }
        )
    }
  }

  submitAddUser() {
    if (this.registerForm.valid) {
      const user: userRegister = {
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
        profile: {
          country: this.registerForm.get('country').value ? this.registerForm.get('country').value : '',
          gender: this.registerForm.get('gender').value ? this.registerForm.get('gender').value : '',
          userName: this.registerForm.get('name').value,
        }
      };
      this.registerForm.reset();
      this.doRegistration(user);
    }
    return;
  }
}

