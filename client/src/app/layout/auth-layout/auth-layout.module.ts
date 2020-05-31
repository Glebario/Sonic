import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {AuthLayoutComponent} from "./auth-layout.component";
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import {SharedModule} from "../../shared/shared.module";
import {AuthServices} from "./services/auth.services";



@NgModule({
  declarations: [
    LoginPageComponent,
    RegistrationPageComponent,
    AuthLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: AuthLayoutComponent, children: [
          {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
          {path: 'sign-in', component: LoginPageComponent},
          {path: 'sign-up', component: RegistrationPageComponent}
        ]
      }
    ])
  ],
  providers: [
    AuthServices,
  ],
  exports: [ RouterModule ]
})
export class AuthLayoutModule { }
