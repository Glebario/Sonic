import { Component, OnInit } from '@angular/core';
import {AuthServices} from "../../../auth-layout/services/auth.services";
import {ActivatedRoute, Params} from "@angular/router";
import {SharedServices} from "../../../../shared/services/shared-services";
import {ImageCroppedEvent} from "ngx-image-cropper";
import {user} from "../../../auth-layout/interface/auth-interface";
import {LocalStorageServices} from "../../../../shared/services/localStorage.services";
import {DataServerServices} from "../../../../shared/services/dataServer.services";
import {post, postPreview} from "../../interface/main-interface";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  public idFromParams: string;
  public userRenderer: { user: user, posts: postPreview[] };
  public blockedBtnInterval: boolean = false;
  public followers: string[];
  public subscription: string[];

  constructor(
    public localStorageServices: LocalStorageServices,
    private authServices: AuthServices,
    public sharedServices: SharedServices,
    private dataServerServices: DataServerServices,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.idFromParams = params.userId;
      this.sharedServices.loadingProgress(true);
      if(params.userId === this.localStorageServices.userData.localId) {
        this.userRenderer = {
          user: this.localStorageServices.userData,
          posts: this.localStorageServices.userPost
        };
        this.dataServerServices.getUser(params.userId)
          .subscribe((response : { user: user, posts: postPreview[] }) => {
            if(this.userRenderer !== response) {
              this.userRenderer = response
            }
          });
        this.sharedServices.loadingProgress(false)
      }
      else {
        this.dataServerServices.getUser(params.userId)
          .pipe(
            delay(1500)
          )
          .subscribe((response : { user: user, posts: postPreview[] }) => {
            this.userRenderer = response;
            this.sharedServices.loadingProgress(false);
          })
      }
    });
  }


//==========================================CROPPER.JS
  imageChangedEvent: any = '';
  image: File;
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
  }
  choose(event: ImageCroppedEvent) {
    this.image = this.sharedServices.dataURLtoFile(event.base64, 'userAvatarFoto.jpeg');
  };


  imageCropped() {
    //=========================Отпровляю фото для получения пути
    this.dataServerServices.updateImg(this.image)
      .subscribe((path: string) => {
        const user: user = this.userRenderer.user;
        user.profile.avatar = path;
        this.dataServerServices.updateUser(user)
          .subscribe((response: user) => {
            this.userRenderer.user = response
          });
      });
  }

  public addRemoveSubscribe() {
    this.followers = this.userRenderer.user.profile.followers;
    this.subscription = this.localStorageServices.userData.profile.subscription;

      const response: {follower: string, subscription: string} = this.checkSubscription();

      if (response) {
        const indexFollower = this.followers.indexOf(response.follower);
        const indexSubscription = this.subscription.indexOf(response.subscription);
        if (indexFollower > -1 && indexSubscription > -1) {
          this.followers.splice(indexFollower, 1);
          this.subscription.splice(indexSubscription, 1);
        }
      } else {
        this.followers.push(this.localStorageServices.userData.localId);
        this.subscription.push(this.userRenderer.user.localId);
      }
    this.userRenderer.user.profile.followers = this.followers;
    this.localStorageServices.userData.profile.subscription = this.subscription;
    console.log(this.subscription);
    console.log(this.followers);
    this.dataServerServices.updateUser(this.localStorageServices.userData)
      .subscribe();
    this.dataServerServices.updateUser(this.userRenderer.user)
      .subscribe((response: user) => {
        this.userRenderer.user = response
      })
  }

  public checkSubscription(): any {
    this.followers = this.userRenderer.user.profile.followers;
    this.subscription = this.localStorageServices.userData.profile.subscription;

    if (this.followers.length && this.subscription.length) {
      const follower: string = this.followers.find((userId) => {
        return userId === this.localStorageServices.userData.localId;
      });
      const subscription: string = this.subscription.find((userId) => {
        return userId === this.idFromParams;
      });
      return {follower, subscription}
    }
    else {
      return null
    }
  }

  public intervalBtn() {
    this.blockedBtnInterval = true;
    setTimeout(() => {
      this.blockedBtnInterval = false
    }, 10000)
  }

}
