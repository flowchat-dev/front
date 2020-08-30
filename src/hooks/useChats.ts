import { useState, useEffect } from "react";
import { IChat } from "../types/commonType";
import api from "../functions/api";
import useRecentChat from "./useRecentChat";

const useChats = (channelId?: string) => {
  const [chats, setChats] = useState<IChat[]>();
  const recentChat = useRecentChat();

  useEffect(() => {
    (async () => {
      if (!channelId) return;
      setChats(await (await api(`chat/${channelId}`)).json());
    })();
  }, [channelId]);

  useEffect(() => {
    if (channelId && recentChat?.channelId && chats && chats[0])
      setChats((beforeChats) =>
        //조건 : 현재 열려있는 채팅방이여야함
        beforeChats &&
        recentChat.channelId === beforeChats[0]?.channelId &&
        // //조건 : 최근 메시지랑 달라야함
        recentChat.chatId !== beforeChats[0].chatId
          ? [recentChat, ...beforeChats!]
          : beforeChats
      );
  }, [channelId, chats, recentChat]);

  if (chats) return [...chats].reverse();
  return chats;
};

export default useChats;
