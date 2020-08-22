import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import user from "../storage/user";
import _ from "lodash";
import ChatByPerson from "./ChatByPerson";
import { ReactComponent as BellSvg } from "../assets/notifications-24px.svg";
import { IChat, IUser, IChannel } from "../types/commonType";
import { ILocalUser } from "../types/interface";
import getUserInfo from "../functions/getUserInfoByUserId";
import { group } from "console";
import { HorizontalWrapper, Icon } from "../atomics";
import useConsole from "../hooks/useConsole";
import ChatInput from "./ChatInput";
import getGroupedChats from "../functions/getGroupedChats";

interface IProps {
  chats: IChat[];
  channel: IChannel;
}

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
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const scrollArea = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollArea.current)
      scrollArea.current.scrollTop = scrollArea.current?.scrollHeight;
    console.log("올라감");
  }, [chats]);

  useEffect(() => {
    getGroupedChats(chats).then((e) => e && setGroupedWithSender(e));
  }, [channelId, chats]);

  useEffect(() => {
    console.log("event added");
    const scrollHandler = () =>
      highlightedIndex !== null && setHighlightedIndex(null);
    window.addEventListener("scroll", scrollHandler, true);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [highlightedIndex]);

  const replyClickHandler = (originChatId: string) => {
    const originChatIndexByGrouped = groupedWithSender
      .map((e) => !!e.chats.find((chat) => chat.chatId === originChatId))
      .indexOf(true);
    setHighlightedIndex(originChatIndexByGrouped);
  };

  return (
    <ChatWrapper {...props}>
      <ChannelHeader>
        <ChannelName>{channelName}</ChannelName>
        <IconWrapper>
          <Bell />
        </IconWrapper>
      </ChannelHeader>
      {chats.length !== 0 ? (
        <ChatListWrapper ref={scrollArea}>
          {groupedWithSender?.map((e, index) => (
            <ChatByPerson
              {...e}
              key={e.chats.map((e) => e.chatId).join("")}
              onClickReply={replyClickHandler}
              isHighlighted={highlightedIndex === index}
            />
          ))}
        </ChatListWrapper>
      ) : (
        <FullInfo>이 채널로부터 받은 메시지가 없습니다</FullInfo>
      )}
      <ChatInput channelId={channelId} />
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
  background-color: white;
`;
const ChatListWrapper = styled.div`
  background-color: #849e9b;
  flex: 1;
  padding: 20px 20px 12px 20px;
  border-radius: 24px 0px 0px 24px;
  overflow-y: scroll;
`;
const Bell = styled(BellSvg)`
  width: 18px;
  margin-right: 24px;
`;
const IconWrapper = styled.div`
  display: flex;
`;

const FullInfo = styled.div`
  font-weight: 700;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  padding-top: 24px;
  flex: 1;
`;
