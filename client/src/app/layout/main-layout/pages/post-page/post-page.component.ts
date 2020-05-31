import { Component, OnInit } from '@angular/core';
import {comment, post} from "../../interface/main-interface";
import {LocalStorageServices} from "../../../../shared/services/localStorage.services";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {DataServerServices} from "../../../../shared/services/dataServer.services";
import {SharedServices} from "../../../../shared/services/shared-services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ImageCroppedEvent} from "ngx-image-cropper";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {

  public idFromParams: string;
  public postRender: post;
  public commentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public localStorageServices: LocalStorageServices,
    private route: ActivatedRoute,
    private dataServerServices: DataServerServices,
    public sharedServices: SharedServices,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.idFromParams = params.userId;

      this.sharedServices.loadingProgress(true);
      this.dataServerServices.getPost(params.postId)
        .subscribe((response: post) => {
          this.postRender = response;
          this.sharedServices.loadingProgress(false);
        });
    });
    this.commentForm = this.formBuilder.group({
      comment: [null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]]
    })
  }

  public addLike() {

    const activeLike = this.sharedServices.checkActiveLike(this.postRender.likes);

    if(activeLike) {
      const index = this.postRender.likes.indexOf(activeLike);
      if (index > -1) {
        this.postRender.likes.splice(index, 1);
      }
      this.dataServerServices.updatePost(this.postRender)
        .subscribe((response : post) => {
          this.postRender = response
          const indexLikePost = this.localStorageServices.userData.profile.favoritePosts.findIndex(likePost => {
            return likePost === this.postRender._id
          });
          this.localStorageServices.userData.profile.favoritePosts.splice(indexLikePost, 1);
          this.dataServerServices.updateUser(this.localStorageServices.userData)
            .subscribe()
        });
    }
    else {
      this.postRender.likes.push(this.localStorageServices.userData.localId);
      this.dataServerServices.updatePost(this.postRender)
        .subscribe((response : post) => {
          this.postRender = response
          this.localStorageServices.userData.profile.favoritePosts.push(this.postRender._id);
          this.dataServerServices.updateUser(this.localStorageServices.userData)
            .subscribe()
        })
    }
  }


  public submitAddComment() {
    if (this.commentForm.valid) {
      const comment: comment = {
        ownerId: this.localStorageServices.userData.localId,
        ownerName: this.localStorageServices.userData.profile.userName,
        ownerAvatar: this.localStorageServices.userData.profile.avatar,
        message: this.commentForm.get('comment').value,
        data: Date.now()
      };
      this.commentForm.reset();
      const reqUpdate: post = this.postRender;
      reqUpdate.comments.push(comment);
      this.dataServerServices.updatePost(reqUpdate)
        .subscribe((response) => {
          this.postRender = response;
        })
    }
  }

  public deletePost() {
    if(this.postRender.owner === this.localStorageServices.userData.localId) {
      this.dataServerServices.removePost(this.postRender)
        .subscribe((response) => {
          this.router.navigate([`/user/${this.localStorageServices.userData.localId}`]);
        });
    }
  }

  public deleteComment(commentDelete) {
    if(commentDelete.ownerId === this.localStorageServices.userData.localId) {
      const indexComment = this.postRender.comments.findIndex(comment => comment === commentDelete);
      this.postRender.comments.splice(indexComment, 1);
      this.dataServerServices.updatePost(this.postRender)
        .subscribe((response: post) => {
          this.postRender = response
        });
    }
  }

  imageChangedEvent: any = '';
  image: File;
  messagePost: string;

//=========================================================
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
  }
  choose(event: ImageCroppedEvent) {
    this.image = this.sharedServices.dataURLtoFile(event.base64, 'userPostFoto.jpeg');
  };

  resetPost() {
    this.imageChangedEvent = null;
    this.image = null;
    this.messagePost = null;
  }

  public editPost() {
    if(this.image) {
      this.dataServerServices.updateImg(this.image)
        .subscribe((path: string) => {
          this.postRender.img = path;
          this.postRender.message = this.messagePost;
          this.dataServerServices.updatePost(this.postRender)
            .subscribe((response: post) => {
              this.postRender = response;
              this.resetPost()
            })
        })
    }
    else {
      this.postRender.message = this.messagePost;
      this.dataServerServices.updatePost(this.postRender)
        .subscribe((response: post) => {
          this.postRender = response;
          this.resetPost()
        })
    }
  }
}
