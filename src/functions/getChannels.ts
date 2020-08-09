import api from "./api"
import { IChannel } from "../types/interface"

export default async () => {
  const fetched = await api(`channel/getChannelList`)
  const sorted = (await fetched.json() as (IChannel & {
    lastMessage: {
      time: number
    }
  })[]).map(e => ({
    ...e,
    lastMessage: {
      ...e.lastMessage,
      time: new Date(e.lastMessage.time * 1000)
    }
  }))
  return sorted
}