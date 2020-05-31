import { Component, OnInit } from '@angular/core';
import {postPreview} from "../../interface/main-interface";
import {LocalStorageServices} from "../../../../shared/services/localStorage.services";
import {DataServerServices} from "../../../../shared/services/dataServer.services";
import {SharedServices} from "../../../../shared/services/shared-services";

@Component({
  selector: 'app-favorite-posts-page',
  templateUrl: './favorite-posts-page.component.html',
  styleUrls: ['./favorite-posts-page.component.css']
})
export class FavoritePostsPageComponent implements OnInit {

  constructor(
    public localStorageServices: LocalStorageServices,
    private dataServerServices: DataServerServices,
    public sharedServices: SharedServices
  ) { }
  public likePosts: postPreview[] = [];

  ngOnInit(): void {
    this.dataServerServices.getFavoritePostsPreview()
      .subscribe((response: postPreview[]) => {
        this.likePosts = response
      })
  }

}
