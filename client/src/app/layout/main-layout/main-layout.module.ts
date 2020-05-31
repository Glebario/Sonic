import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {ModalModule} from "ngx-bootstrap/modal";
import {MainLayoutComponent} from "./main-layout.component";
import {RouterModule} from "@angular/router";
import {AuthGuard} from "../../shared/classes/auth.guard";
import {UserPageComponent} from "./pages/user-page/user-page.component";
import {ImageCropperModule} from "ngx-image-cropper";
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import {LocalStorageServices} from "../../shared/services/localStorage.services";
import {DataServerServices} from "../../shared/services/dataServer.services";
import { SettingPageComponent } from './pages/setting-page/setting-page.component';
import { PostPageComponent } from './pages/post-page/post-page.component';
import { UsersSearchPageComponent } from './pages/users-search-page/users-search-page.component';
import { AllUsersPageComponent } from './pages/users-search-page/all-users-page/all-users-page.component';
import { FollowersUsersPageComponent } from './pages/users-search-page/followers-users-page/followers-users-page.component';
import { SubscriptionUsersPageComponent } from './pages/users-search-page/subscription-users-page/subscription-users-page.component';
import { FavoritePostsPageComponent } from './pages/favorite-posts-page/favorite-posts-page.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import { PostsFeedPageComponent } from './pages/posts-feed-page/posts-feed-page.component';



@NgModule({
  declarations: [
    MainLayoutComponent,
    UserPageComponent,
    CreatePostPageComponent,
    SettingPageComponent,
    PostPageComponent,
    UsersSearchPageComponent,
    AllUsersPageComponent,
    FollowersUsersPageComponent,
    SubscriptionUsersPageComponent,
    FavoritePostsPageComponent,
    PostsFeedPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
      {
        path: '', component: MainLayoutComponent, canActivate: [AuthGuard], children: [
          {path: 'posts-feed', component: PostsFeedPageComponent},
          {path: 'user/:userId', component: UserPageComponent},
          {path: 'user/:userId/post/:postId', component: PostPageComponent},
          {
            path: 'users', component: UsersSearchPageComponent, children: [
              {path: 'users', redirectTo: '/allUsers', pathMatch: 'full'},
              {path: 'allUsers', component: AllUsersPageComponent},
              {path: 'my-followers', component: FollowersUsersPageComponent},
              {path: 'my-subscription', component: SubscriptionUsersPageComponent},
            ]
          },
          {path: 'favoritePosts', component: FavoritePostsPageComponent},
          {path: 'creation', component: CreatePostPageComponent},
          {path: 'settings', component: SettingPageComponent}
        ]
      }
    ]),
    ImageCropperModule,
    InfiniteScrollModule
  ],
  providers: [
    AuthGuard,
    LocalStorageServices,
    DataServerServices
  ]
})
export class MainLayoutModule { }
