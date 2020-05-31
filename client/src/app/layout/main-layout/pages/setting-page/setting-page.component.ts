import { Component, OnInit } from '@angular/core';
import {AuthServices} from "../../../auth-layout/services/auth.services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent {

  constructor(
    private auth: AuthServices,
    private router: Router
  ) { }


  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/sign-in'])
  }

}
