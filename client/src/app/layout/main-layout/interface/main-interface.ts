export interface post {
  ownerUser: {
    userName: string
    avatar: string
  },
  comments: comment[],
  _id: string
  owner: string
  data: string
  img: string
  message?: string
  likes?: string[]
}

export class postCreated {
  ownerUser: {
    userName: string
    avatar: string
  };
  img: string;
  message?: string;
  data: number
}

export interface postPreview {
  userId: string,
  postId: string,
  img: string,
  likes: string[],
  comments: number
}
export interface Message {
  message: string
}

export interface localId {
  localId: string
}

export  interface comment {
  ownerName: string
  ownerAvatar: string
  ownerId: string
  message: string
  data: number
}

export interface sharedData {
  avatarIcon?: string
  likeIcon?: string
  likeActiveIcon?: string
  commentIcon?: string
}
