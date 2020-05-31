import { Component, OnInit } from '@angular/core';
import {userPreview} from "../../../../auth-layout/interface/auth-interface";
import {LocalStorageServices} from "../../../../../shared/services/localStorage.services";
import {DataServerServices} from "../../../../../shared/services/dataServer.services";

@Component({
  selector: 'app-subscription-users-page',
  templateUrl: './subscription-users-page.component.html',
  styleUrls: ['./subscription-users-page.component.css']
})
export class SubscriptionUsersPageComponent implements OnInit {

  public users: userPreview[];

  constructor(
    private localStorageServices: LocalStorageServices,
    private dataServerServices: DataServerServices
  ) { }

  ngOnInit(): void {
    this.dataServerServices.getAllSubscriptions()
      .subscribe((response) => {
        this.users = response.users
      })
  }
}
