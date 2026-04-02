export interface IUser {
  _id: string
  name: string
  email: string
  username: string
  image?: string
  bio?: string
  createdAt: Date
}

export interface ILink {
  _id: string
  userId: string
  title: string
  url: string
  icon?: string
  clicks: number
  order: number
  createdAt: Date
}

export interface IClickEvent {
  _id: string
  linkId: string
  clickedAt: Date
  userAgent?: string
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type LinksResponse = ApiResponse<ILink[]>

export type PublicProfile = {
  user: Pick<IUser, "name" | "username" | "image" | "bio">
  links: Pick<ILink, "_id" | "title" | "url" | "icon" | "clicks">[]
}