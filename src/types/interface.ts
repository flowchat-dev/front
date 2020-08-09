export interface IChat {
  text: string;
  image?: string;
  channelId: string;
  senderId?: string;
  time: Date;
}
export interface IChannel {
  profileImage: string | string[],
  name: string,
  lastMessage: IChat;
  id: string
}
export interface IUser {
  name: string;
  profileImage: string;
  id: string;
}
export interface ILocalUser extends IUser {
  expired: number
}
