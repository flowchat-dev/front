import { useState, useEffect } from "react"
import { IChat } from "../types/interface"
import api from "../functions/api"
import useRecentChat from "./useRecentChat"

const useChats = (channelId?: string) => {
  const [chats, setChats] = useState<IChat[]>([])
  const recentChat = useRecentChat()

  useEffect(() => {
    (async () => {
      if(!channelId) return
      setChats(await (await api(`chat/${channelId}`)).json())
    })()
  }, [channelId])

  useEffect(() => {
    console.log(recentChat)
    if(!recentChat) return
    setChats(beforeChats => [recentChat, ...beforeChats])
  }, [recentChat])
  return [...chats].reverse()
}

export default useChats