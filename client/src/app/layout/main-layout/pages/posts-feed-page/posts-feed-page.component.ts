import { Component, OnInit } from '@angular/core';
import {comment, post} from "../../interface/main-interface";
import {LocalStorageServices} from "../../../../shared/services/localStorage.services";
import {SharedServices} from "../../../../shared/services/shared-services";
import {DataServerServices} from "../../../../shared/services/dataServer.services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-posts-feed-page',
  templateUrl: './posts-feed-page.component.html',
  styleUrls: ['./posts-feed-page.component.css']
})
export class PostsFeedPageComponent implements OnInit {

  public posts: post[];
  public commentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public localStorageServices: LocalStorageServices,
    public sharedServices: SharedServices,
    private dataServerServices: DataServerServices
  ) { }

  ngOnInit(): void {
    this.dataServerServices.getAllPost(0)
      .subscribe((response) => {
        this.posts = response.posts
      });

    this.commentForm = this.formBuilder.group({
      comment: [null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]]
    })
  }

  onScroll() {
    console.log(`gggggg`);
    const counterUser = this.posts.length;
    this.dataServerServices.getAllPost(counterUser)
      .subscribe((response) => {
        this.posts = this.posts.concat(response.posts);
      })
  }

  addLike(post :post) {
    if(!this.sharedServices.checkActiveLike(post.likes)) {
      post.likes.push(this.localStorageServices.userData.localId);
      this.localStorageServices.userData.profile.favoritePosts.push(post._id);
    }
    else {

      const indexLike = post.likes.findIndex((idLike) => {
        return idLike === this.localStorageServices.userData.localId
      });
      post.likes.splice(indexLike, 1);

      const indexPost = this.localStorageServices.userData.profile.favoritePosts.findIndex((postId) => {
        return postId === post._id
      });
      this.localStorageServices.userData.profile.favoritePosts.splice(indexPost, 1)

    }
    this.dataServerServices.updatePost(post)
      .subscribe((response: post) => {
        const indexPost = this.posts.findIndex((post: post) => {
          return post._id === response._id
        });
        this.posts[indexPost] = response
      });
    this.dataServerServices.updateUser(this.localStorageServices.userData)
      .subscribe()
  }

  public submitAddComment(post: post) {
    if (this.commentForm.valid) {
      const comment: comment = {
        ownerId: this.localStorageServices.userData.localId,
        ownerName: this.localStorageServices.userData.profile.userName,
        ownerAvatar: this.localStorageServices.userData.profile.avatar,
        message: this.commentForm.get('comment').value,
        data: Date.now()
      };
      this.commentForm.reset();
      const reqUpdate: post = post;
      reqUpdate.comments.push(comment);
      this.dataServerServices.updatePost(reqUpdate)
        .subscribe((response: post) => {
          const indexPost = this.posts.findIndex((post: post) => {
            return post._id === response._id
          });
          this.posts[indexPost] = response
        });
    }
  }

  public deleteComment(post: post, commentDelete: comment) {
    if(commentDelete.ownerId === this.localStorageServices.userData.localId) {
      const indexComment = post.comments.findIndex(comment => comment === commentDelete);
      post.comments.splice(indexComment, 1);
      this.dataServerServices.updatePost(post)
        .subscribe((response: post) => {
          const indexPost = this.posts.findIndex((post: post) => {
            return post._id === response._id
          });
          this.posts[indexPost] = response
        });
    }
  }
}
