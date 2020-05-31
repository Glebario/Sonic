import {Component, OnInit} from '@angular/core';
import {AuthServices} from "./layout/auth-layout/services/auth.services";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private auth: AuthServices) {
  }

  ngOnInit() {
    const potentialToken = localStorage.getItem('auth-token')
    if (potentialToken !== null) {
      this.auth.setToken(potentialToken)
    }
  }
}
