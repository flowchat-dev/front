import api from "./api"
import { IChannel } from "../types/commonType"
import { IChannelFromDB } from "../types/interface"

export default async () => {
  const fetched = await api(`channel/getChannelList`)
  const sorted = (await fetched.json() as IChannelFromDB[]).map(e => ({
    ...e,
    ...(e.lastMessage && {
      lastMessage: {
        ...e.lastMessage,
        time: new Date(e.lastMessage.time * 1000)
      }
    })
  }))
  return sorted
}