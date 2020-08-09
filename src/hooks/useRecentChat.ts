import useSocket from "./useSocket";
import { useState, useEffect } from "react";
import { IChat } from "../types/interface";
import chatToJsDate from "../functions/chatToJsDate";

const useRecentChat = () => {
  const _rawRecentMessage = useSocket<{
    type: string;
    content: IChat & {
      time: number;
    };
  }>("message")?.content;
  
  const [recentMessage, setRecentMessage] = useState<IChat>();
  useEffect(() => {
    if (!_rawRecentMessage) return;
    setRecentMessage(chatToJsDate(_rawRecentMessage));
  }, [_rawRecentMessage]);
  return recentMessage
}
export default useRecentChat