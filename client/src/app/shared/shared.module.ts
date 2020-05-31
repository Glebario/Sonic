import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedServices} from "./services/shared-services";
import {TokenInterceptor} from "./classes/token.interceptor";



@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    SharedServices
  ]
})
export class SharedModule { }
