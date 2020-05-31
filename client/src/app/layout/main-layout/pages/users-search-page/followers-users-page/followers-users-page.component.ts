import { Component, OnInit } from '@angular/core';
import {LocalStorageServices} from "../../../../../shared/services/localStorage.services";
import {userPreview} from "../../../../auth-layout/interface/auth-interface";
import {DataServerServices} from "../../../../../shared/services/dataServer.services";


@Component({
  selector: 'app-followers-users-page',
  templateUrl: './followers-users-page.component.html',
  styleUrls: ['./followers-users-page.component.css']
})
export class FollowersUsersPageComponent implements OnInit {

  public users: userPreview[];

  constructor(
    private localStorageServices: LocalStorageServices,
    private dataServerServices: DataServerServices
  ) { }

  ngOnInit(): void {
    this.dataServerServices.getAllFollowers()
      .subscribe((response) => {
        this.users = response.users
      })
  }

  onScroll() {
    console.log(`gggggg`)
  }

}
