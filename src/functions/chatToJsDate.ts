import { IChat } from "../types/commonType";

export default (chat: IChat & {
  time: string
}): IChat => ({
  ...chat,
  time: new Date(chat.time)
})