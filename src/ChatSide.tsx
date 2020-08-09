import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import user from "./storage/user";
import _ from "lodash";
import ChatByPerson from "./ChatByPerson";
import { ReactComponent } from "./assets/notifications-24px.svg";
import { IChat, IUser, ILocalUser, IChannel } from "./types/interface";
import getUserInfo from "./functions/getUserInfoByUserId";
import { group } from "console";

interface IProps {
  chats: IChat[];
  channel: IChannel;
}

type IGroupedChatWithSenderId = {
  senderId: string;
  chats: IChat[];
}[];

type IGroupedChatWithSenderInfo = {
  sender: ILocalUser;
  chats: IChat[];
}[];

export default ({
  chats,
  channel: { id: channelId, name: channelName },
  ...props
}: IProps) => {
  const [groupedWithSender, setGroupedWithSender] = useState<
    IGroupedChatWithSenderInfo
  >([]);
  const scrollArea = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // console.log(
    scrollArea.current?.scrollTo({
      top: 10000,
    });
    // );
  }, [groupedWithSender]);
  useEffect(() => {
    // console.log(channel);
    if (!chats[0]) return;
    let groupedWithSenderId: IGroupedChatWithSenderId = [
      {
        senderId: chats[0].senderId!,
        chats: [chats[0]],
      },
    ];
    chats.slice(1).forEach((e) => {
      if (
        groupedWithSenderId[groupedWithSenderId.length - 1].senderId ===
        e.senderId
      ) {
        groupedWithSenderId[groupedWithSenderId.length - 1].chats = [
          ...groupedWithSenderId[groupedWithSenderId.length - 1].chats,
          e,
        ];
      } else {
        groupedWithSenderId = [
          ...groupedWithSenderId,
          {
            senderId: e.senderId!,
            chats: [e],
          },
        ];
      }
    });
    Promise.all(
      groupedWithSenderId.map(async (e) => ({
        chats: e.chats,
        sender: await user.get(e.senderId, e.chats[0].channelId!),
      }))
    ).then((e) => setGroupedWithSender(() => e));
  }, [channelId, chats]);

  return (
    <ChatWrapper {...props}>
      <ChannelHeader>
        <ChannelName>{channelName}</ChannelName>
        <IconWrapper>
          <Bell />
        </IconWrapper>
      </ChannelHeader>
      <ChatListWrapper ref={scrollArea}>
        {groupedWithSender?.map((e) => (
          <ChatByPerson {...e} key={e.sender.id + +e.chats[0].time} />
        ))}
      </ChatListWrapper>
    </ChatWrapper>
  );
};

const ChannelHeader = styled.div`
  padding-bottom: 18px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
`;
const ChannelName = styled.h1`
  font-size: 18px;
  margin: 0px;
`;
const ChatWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
const ChatListWrapper = styled.div`
  background-color: #849e9b;
  flex: 1;
  padding: 20px;
  border-radius: 24px 0px 0px 24px;
  overflow-y: scroll;
`;
const Bell = styled(ReactComponent)`
  width: 18px;
  margin-right: 24px;
`;
const IconWrapper = styled.div`
  display: flex;
`;
