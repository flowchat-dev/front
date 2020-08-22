import {ChatAttachment, ChatType} from './includedInterface'
export interface PhotoAttach {
  url: string;
  type: ChatType.Photo
}
export interface ReplyAttach {
  originMessage: string;
  originChat: string;
  type: ChatType.Reply
}
export interface IChat {
  text: string;
  attachment?: (PhotoAttach|ReplyAttach|undefined)[];
  channelId: string;
  senderId: string;
  chatId: string;
  time: Date;
}
export type ISendingChat = IChat & {
  chatId?: string;
}
export interface IUser {
  name: string;
  profileImage: string;
  id: string;
}
export interface IChannel {
  profileImage: string | string[],
  name: string,
  lastMessage?: IChat|null;
  id: string
}