import { useState, useEffect } from "react"
import { IChannel } from "../types/interface"

import getChannels from '../functions/getChannels'
import useRecentChat from "./useRecentChat"
const useChannels = () => {
  const [channels, setChannels] = useState<IChannel[]>()
  const recentChat = useRecentChat()

  useEffect(() => {
    (async () => {
      setChannels(await getChannels())
    })()
  }, [])
  
  useEffect(() => {
    setChannels(
      (beforeChannels) =>
        beforeChannels &&
        recentChat && [
          {
            ...beforeChannels.find((e) => e.id === recentChat.channelId)!,
            lastMessage: recentChat,
          },
          ...beforeChannels.filter((e) => e.id !== recentChat.channelId),
        ]
    );
  }, [recentChat]);

  return channels
}
export default useChannels