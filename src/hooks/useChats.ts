import { useState, useEffect } from "react";
import { IChat } from "../types/commonType";
import api from "../functions/api";
import useRecentChat from "./useRecentChat";
import useStorage from "./useStorage";
import useConsole from "./useConsole";

const setChatLogByChannel = (channelId: string, chatId: string) => {
  console.log("Set!", channelId, chatId);
  const storageKey = `CHATLOG/${channelId}`;
  const stored = localStorage.getItem(storageKey);
  if (stored)
    try {
      const parsed: string[] = JSON.parse(stored);
      localStorage.setItem(
        storageKey,
        JSON.stringify([...parsed, chatId].slice(-100))
      );
    } catch (e) {
      console.log("Configuring new Channel..");
      localStorage.setItem(storageKey, `["${chatId}"]`);
    }
  else {
    console.log("Configuring new Channel..");
    localStorage.setItem(storageKey, `["${chatId}"]`);
  }
};

const get100AgoChatByChannel = (channelId: string) => {
  const storageKey = `CHATLOG/${channelId}`;
  const stored = localStorage.getItem(storageKey);
  if (stored)
    try {
      const parsed: string[] = JSON.parse(stored);
      return parsed[0];
    } catch {
      return "NO DTA";
    }
};

const useChats = (channelId?: string) => {
  const [chats, setChats] = useState<IChat[]>();
  const recentChat = useRecentChat();
  // const [thisChannelLastChatId, setThisChannelLastChatId] = useStorage(
  //   `CHATLOG/${channelId}`
  // );
  useEffect(() => {
    (async () => {
      if (!channelId) return;
      const gettingFrom = get100AgoChatByChannel(channelId);

      console.log(channelId, gettingFrom);
      if (!gettingFrom) setChats([]);
      else
        setChats(await (await api(`chat/${channelId}/${gettingFrom}`)).json());
    })();
  }, [channelId]);

  useEffect(() => {
    console.log(recentChat);
    if (recentChat?.channelId && recentChat?.chatId)
      setChatLogByChannel(recentChat?.channelId, recentChat?.chatId);
  }, [recentChat]);

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
