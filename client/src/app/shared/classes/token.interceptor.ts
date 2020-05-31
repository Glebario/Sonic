import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {AuthServices} from "../../layout/auth-layout/services/auth.services";
import {catchError, tap} from "rxjs/operators";
import {Router} from "@angular/router";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthServices,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: this.auth.getToken()
        }
      })
    }

    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('[Interceptor Error]: ', error);
          if (error.status === 401) {
            this.auth.logout();
            this.router.navigate(['/sign-in'], {
              queryParams: {
                authFailed: true
              }
            })
          }
          return throwError(error)
        })
      )
  }
}
