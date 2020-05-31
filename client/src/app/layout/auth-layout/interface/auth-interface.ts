export interface userLogin {
  email: string
  password: string
}

export interface userRegister {
  email: string
  password: string
  profile: {
    country?: string
    gender?: string
    userName: string
    avatar?: string
    followers?: string[]
    subscription?: string[]
    posts?: []
    favoritePosts?: string[]
  }
}

export interface user {
  localId: string
  profile: {
    country?: string
    gender?: string
    userName: string
    avatar?: string
    followers?: string[]
    subscription?: string[]
    posts?: []
    favoritePosts?: string[]
  }
}

export interface userPreview {
  followers?: number
  avatar: string
  userName: string
  localId: string
}

export interface authResponse {
  token: string
  userResponse: user
}

export class errorResponse {
  status: number;
  error: {
    message: string
  }
}


