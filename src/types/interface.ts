import { IUser, IChannel, IChat } from "./commonType";

export interface ILocalUser extends IUser {
  expired: number
}
export interface IChannelFromDB extends IChannel {
  lastMessage?: IChat & {
    time: number
  }
}