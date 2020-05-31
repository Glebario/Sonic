import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {user, userPreview} from "../../layout/auth-layout/interface/auth-interface";
import {
  Message,
  postCreated,
  post,
  localId,
  sharedData, postPreview
} from "../../layout/main-layout/interface/main-interface";
import {Observable} from "rxjs";
import {LocalStorageServices} from "./localStorage.services";
import {tap} from "rxjs/operators";

@Injectable()

export class DataServerServices {
  constructor(
    private http: HttpClient,
    private localStorageServices: LocalStorageServices
  ){}


  getUser(localId) {
    return this.http.get<{ user: user, posts: postPreview[] }>(`/api/user/userId/${localId}`)
      .pipe(
        tap(
          (response: { user: user, posts: postPreview[] }) => {
            if(response.user.localId === this.localStorageServices.userData.localId) {
              this.localStorageServices.localStorageUser(response.user);
              this.localStorageServices.localStorageAllPosts(response.posts)
            }
          }
        )
      )
  }

  updateUser(user: user): Observable<user> {
    return this.http.patch<user>(`/api/user/${user.localId}`, user)
      .pipe(
        tap((response: user) => {
          if(response.localId === this.localStorageServices.userData.localId) {
            this.localStorageServices.localStorageUser(response);
          }
        })
      )
  }

  removeUser(localId) {
    return this.http.delete<Message>(`/api/user/${localId}`)
      .subscribe((response) => {
        console.log(response)
      });
  }

  getAllFollowers(): Observable<{users: userPreview[]}> {
    return this.http.get<{users: userPreview[]}>(`/api/user/followers`)
  }

  getAllSubscriptions(): Observable<{users: userPreview[]}> {
    return this.http.get<{users: userPreview[]}>(`/api/user/subscription`)
  }

  getAllUser(seensUser): Observable<{users: userPreview[]}> {
    return this.http.get<{users: userPreview[]}>(`/api/user/allUsers/${0 + seensUser}`)
  }

  addPost(post: postCreated): Observable<localId> {
    return this.http.post<localId>(`/api/post/`, post)
      .pipe(
        tap((response: localId) => {
          this.getUser(response.localId)
            .subscribe()
        })
      )
  }

  updatePost(post: post): Observable<post> {
    return this.http.patch<post>(`/api/post/${post._id}`, post)
      .pipe(
        tap((response: post) => {

        })
      )
  }

  removePost(post: post) {
    return this.http.delete<Message>(`/api/post/${post._id}`)
  }

  getPost(postId): Observable<post> {
    return this.http.get<post>(`/api/post/${postId}`)
      .pipe(
        tap((response) => {
          if(response) {

          }
        })
      )
  }

  getFavoritePostsPreview(): Observable<postPreview[]> {
    return this.http.get<postPreview[]>(`/api/post/preview/favorite/`)
  }

  getAllPost(seenPosts): Observable<{posts: post[]}> {
    return this.http.get<{posts: post[]}>(`/api/post/feedPosts/${0 + seenPosts}`)
  }

  getAllPostPreview() {
    return this.http.get<{postsPreview: postPreview[]}>(`/api/post/preview/`)
      .subscribe((response: {postsPreview: postPreview[]}) => {
        this.localStorageServices.localStorageAllPosts(response.postsPreview)
      });
  }



  getSharedData(): Observable<sharedData> {
    return this.http.get<sharedData>(`/api/shared/getShared`)
      .pipe(
      tap((response: sharedData) => {
        this.localStorageServices.getSharedData(response)
      })
      )
  }

  updateImg(image) {
    const fd = new FormData();
    fd.append('image', image, image.name);
    return this.http.post(`/api/shared/addFoto`, fd)
  }

}
