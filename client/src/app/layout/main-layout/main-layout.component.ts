import { Component, OnInit } from '@angular/core';
import {LocalStorageServices} from "../../shared/services/localStorage.services";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  constructor(
    public localStorageServices: LocalStorageServices
  ) { }

  ngOnInit(): void {
  }

}
