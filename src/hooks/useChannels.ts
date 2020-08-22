import { useState, useEffect } from "react";
import { IChannel } from "../types/commonType";

import getChannels from "../functions/getChannels";
import useRecentChat from "./useRecentChat";
const useChannels = () => {
  const [channels, setChannels] = useState<IChannel[]>();
  const recentChat = useRecentChat();

  useEffect(() => {
    (async () => {
      setChannels(await getChannels());
    })();
  }, []);

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

  useEffect(() => {
    const channelIds = channels?.map((e) => e.id);
    if (!channelIds) return;
    if (recentChat?.channelId && channelIds.includes(recentChat?.channelId))
      getChannels().then(setChannels);
  }, [recentChat]);

  return channels;
};
export default useChannels;
