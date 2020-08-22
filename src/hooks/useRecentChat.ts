import useSocket from "./useSocket";
import { useState, useEffect } from "react";
import { IChat } from "../types/commonType";
import chatToJsDate from "../functions/chatToJsDate";
import useConsole from "./useConsole";

const useRecentChat = () => {
  const _rawRecentMessage = useSocket<{
    type: string;
    content: IChat & {
      time: string;
    };
  }>("message")?.content;
  
  const [recentMessages, setRecentMessages] = useState<IChat>();
  useConsole('RECENTMESSAGE', recentMessages)
  useEffect(() => {
    if (!_rawRecentMessage) return;
    setRecentMessages(chatToJsDate(_rawRecentMessage));
  }, [_rawRecentMessage]);
  return recentMessages
}
export default useRecentChat