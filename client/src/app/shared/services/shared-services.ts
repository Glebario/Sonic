import {Injectable, TemplateRef} from "@angular/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {LocalStorageServices} from "./localStorage.services";
import {post} from "../../layout/main-layout/interface/main-interface";

@Injectable()

export class SharedServices {
  constructor(
    private modalServices: BsModalService,
    private localStorageServices: LocalStorageServices
  ) {}

  //==================================ЛЕЙБЛ ЗАГРУЗКИ===================================
  public loading: boolean = false;

  public loadingProgress(key: boolean) {
    this.loading = key;
    return key
  }

  //==================================МОДАЛКА================================
  modalRef: BsModalRef;

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalServices.show(template);
  }

  //=================================ПРОВЕРКА НАЛИЧИЯ ЛАЙКА У ПОСТА===========
  public checkActiveLike(likes: string[]) {
    const activeLike = likes.find((likeUserId) => {
      return likeUserId === this.localStorageServices.userData.localId;
    });
    if(activeLike) {
      return activeLike
    }
    else {
      return null
    }
  }

  //=================================BASE64 в файл============================
  dataURLtoFile(dataUrl: string, filename: string) {
    const arr = dataUrl.split(',');
    const byteString = window.atob(arr[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    const imageFile = new File([blob], filename, { type: 'image/jpeg' });
    return imageFile;
  }
}
