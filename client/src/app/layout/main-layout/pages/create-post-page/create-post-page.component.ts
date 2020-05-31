import {Component, OnInit} from '@angular/core';
import {LocalStorageServices} from "../../../../shared/services/localStorage.services";
import {AuthServices} from "../../../auth-layout/services/auth.services";
import {SharedServices} from "../../../../shared/services/shared-services";
import {Router} from "@angular/router";
import {ImageCroppedEvent} from "ngx-image-cropper";
import {postCreated} from "../../interface/main-interface";
import {DataServerServices} from "../../../../shared/services/dataServer.services";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-create-post-page',
  templateUrl: './create-post-page.component.html',
  styleUrls: ['./create-post-page.component.css']
})
export class CreatePostPageComponent {

  constructor(
    public localStorageServices: LocalStorageServices,
    private authServices: AuthServices,
    public sharedServices: SharedServices,
    private dataServerServices: DataServerServices,
    private router: Router,
  ) { }

  postStatus: boolean = false;

  imageChangedEvent: any = '';
  image: File;
  preview: string;
  croppedImage: any = '';
  messagePost: string;

//=========================================================
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
  }
  choose(event: ImageCroppedEvent) {
    this.preview = event.base64;
    this.image = this.sharedServices.dataURLtoFile(event.base64, 'userPostFoto.jpeg');
  };
  imageCropped() {
    this.croppedImage = this.preview;
  }
//===========================================================
  postStatusChange() {
    this.postStatus = true;
  }

  postCreate() {
    this.sharedServices.loadingProgress(true);
    const post: postCreated = {
      ownerUser: {
        userName: this.localStorageServices.userData.profile.userName,
        avatar: this.localStorageServices.userData.profile.avatar
      },
      img: '',
      message: this.messagePost ? this.messagePost : '',
      data: Date.now()
    };
    this.dataServerServices.updateImg(this.image)
      .pipe(
        delay(1500)
      )
      .subscribe((path: string) => {
        post.img = path;
        console.log(this.messagePost);
        this.dataServerServices.addPost(post)
          .subscribe(() => {
            this.sharedServices.loadingProgress(false);
            this.router.navigate([`/user/${this.localStorageServices.userData.localId}`]);
          })
      })
  }

  resetPost() {
    this.postStatus = false;
    this.croppedImage = '';
    this.messagePost = '';
  }
}
