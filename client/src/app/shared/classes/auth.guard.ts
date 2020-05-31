import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthServices} from "../../layout/auth-layout/services/auth.services";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private AuthServices: AuthServices,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.AuthServices.isAuthenticated()) {
      return true
    }
    else {
      this.router.navigate(['/sign-in'], {
        queryParams: {
          loginAgain: true
        }
      });
      return false
    }
  }
}
