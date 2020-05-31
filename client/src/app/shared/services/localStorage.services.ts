import {Injectable} from "@angular/core";
import {user} from "../../layout/auth-layout/interface/auth-interface";
import {post, postPreview, sharedData} from "../../layout/main-layout/interface/main-interface";

@Injectable()

export class LocalStorageServices {

  public sharedData: sharedData = localStorage.getItem('sharedData') ? JSON.parse(localStorage.getItem('sharedData')) : null;
  public userData: user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  public userPost: postPreview[] = localStorage.getItem('userPost') ? JSON.parse(localStorage.getItem('userPost')) : null;
  public userOtherPost: postPreview[] = localStorage.getItem('userOtherPost') ? JSON.parse(localStorage.getItem('userOtherPost')) : null;

  //======================================МОЙ АККАУНТ=====================================
  public localStorageUser(dataUserWithServer: user) {
    if(localStorage.getItem('user')) {
      localStorage.removeItem('user')
    }

    localStorage.setItem('user', JSON.stringify(dataUserWithServer));
    this.userData = dataUserWithServer;
  }


  //==========================================ЗАГРУЗКА ПОСТОВ ЮЗЕРА============================
  public localStorageAllPosts(posts: postPreview[]) {
    const userOtherPost: postPreview[] = [];
    const userPost: postPreview[] = [];

    posts.forEach((post: postPreview) => {
      if(post.userId == this.userData.localId) {
        userPost.push(post)
      }
      else {
        userOtherPost.push(post)
      }
    });

    if(userPost) {
      if(localStorage.getItem('userPost')) {
        localStorage.removeItem('userPost')
      }

      localStorage.setItem('userPost', JSON.stringify(userPost));
      this.userPost = userPost;
    }

    if(userOtherPost) {
      if(localStorage.getItem('userOtherPost')) {
        localStorage.removeItem('userOtherPost')
      }

      localStorage.setItem('userOtherPost', JSON.stringify(userOtherPost));
      this.userOtherPost = userOtherPost;
    }
  }

   public getSharedData(sharedData: sharedData) {
     if(localStorage.getItem('sharedData')) {
       localStorage.removeItem('sharedData')
     }

     localStorage.setItem('sharedData', JSON.stringify(sharedData));
     this.sharedData = sharedData;
  }
}
