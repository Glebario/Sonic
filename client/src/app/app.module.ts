import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthLayoutModule} from "./layout/auth-layout/auth-layout.module";
import {MainLayoutModule} from "./layout/main-layout/main-layout.module";
import {SharedModule} from "./shared/shared.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "./shared/classes/token.interceptor";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainLayoutModule,
    AuthLayoutModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
