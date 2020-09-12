import React from "react";
import { IGroupedChatWithSenderInfo } from "./ChatSide";
import ChatByPerson from "./ChatByPerson";

interface IProps {
  data: IGroupedChatWithSenderInfo;
}

const VirtualizedChatList: React.FC<IProps> = ({ data }) => {
  console.log(data, data[0]);
  return (
    <>
      {data.map((e, index) => (
        <ChatByPerson {...e} key={e.chats.map((e) => e.chatId).join("")} />
      ))}
    </>
  );
};

export default VirtualizedChatList;
