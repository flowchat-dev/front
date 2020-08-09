import { IChat } from "../types/interface";

export default (chat: IChat & {
  time: number
}): IChat => ({
  ...chat,
  time: new Date(chat?.time * 1000)
})