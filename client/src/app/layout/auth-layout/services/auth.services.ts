import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay, tap} from "rxjs/operators";
import {userLogin, userRegister, authResponse} from "../interface/auth-interface";
import {Observable} from "rxjs";
import {LocalStorageServices} from "../../../shared/services/localStorage.services";
import {DataServerServices} from "../../../shared/services/dataServer.services";

@Injectable()

export class AuthServices {
  private token = null;

  constructor(
    private http: HttpClient,
    private localStorageServices: LocalStorageServices,
    private dataServerServices: DataServerServices
  ) {}

  // ===========================Добовление пользователя в базу данных (DATA BASE) ================
  register(user: userRegister): Observable<authResponse> {
    return this.http.post<authResponse>('/api/auth/register', user)
  }


  // ===========================Авторизация пользователя в FIREBASE Authorization ================
  login(user: userLogin): Observable<authResponse> {
    return this.http.post<authResponse>('/api/auth/login', user)
      .pipe(
        tap(
          (response: authResponse) => {
            localStorage.setItem('auth-token', response.token);
            this.setToken(response.token);
            // @ts-ignore
            this.localStorageServices.localStorageUser(response.userResponse);
            this.dataServerServices.getAllPostPreview();
            this.dataServerServices.getSharedData()
              .subscribe()
          })
      )
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  logout() {
    this.token = null;
    localStorage.clear()
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token
  }

}
