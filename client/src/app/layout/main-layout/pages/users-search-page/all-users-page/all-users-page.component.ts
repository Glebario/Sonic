import { Component, OnInit } from '@angular/core';
import {userPreview} from "../../../../auth-layout/interface/auth-interface";
import {LocalStorageServices} from "../../../../../shared/services/localStorage.services";
import {DataServerServices} from "../../../../../shared/services/dataServer.services";

@Component({
  selector: 'app-all-users-page',
  templateUrl: './all-users-page.component.html',
  styleUrls: ['./all-users-page.component.css']
})
export class AllUsersPageComponent implements OnInit {

  public users: userPreview[];

  constructor(
    private localStorageServices: LocalStorageServices,
    private dataServerServices: DataServerServices
  ) { }

  ngOnInit(): void {
    this.dataServerServices.getAllUser(0)
      .subscribe((response) => {
        this.users = response.users

      })
  }

  onScroll() {
    console.log(`gggggg`);
    const counterUser = this.users.length;
    this.dataServerServices.getAllUser(counterUser)
      .subscribe((response) => {
        this.users = this.users.concat(response.users);
      })
  }

}
