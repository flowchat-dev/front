import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import user from "./storage/user";
import _ from "lodash";
import ChatByPerson from "./ChatByPerson";
import { ReactComponent as BellSvg } from "./assets/notifications-24px.svg";
import { ReactComponent as SendSvg } from "./assets/send-24px.svg";
import { IChat, IUser, IChannel } from "./types/commonType";
import { ILocalUser } from "./types/interface";
import getUserInfo from "./functions/getUserInfoByUserId";
import { group } from "console";
import { HorizontalWrapper, Icon } from "./atomics";
import sendMessage from "./functions/sendMessage";
import useConsole from "./hooks/useConsole";

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
    scrollArea.current?.scrollTo({
      top: 10000,
    });
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
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  useEffect(() => {
    console.log("event added");
    const scrollHandler = () =>
      highlightedIndex !== null && setHighlightedIndex(null);
    window.addEventListener("scroll", scrollHandler, true);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [highlightedIndex]);
  useConsole("HIGHLIGHED", highlightedIndex);
  const inputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const { currentTarget } = e;
    const message = currentTarget.value;
    currentTarget.value = "";
    sendMessage(channelId, message);
  };
  const replyClickHandler = (originChatId: string) => {
    const originChatIndexByGrouped = groupedWithSender
      .map((e) => !!e.chats.find((chat) => chat.chatId === originChatId))
      .indexOf(true);
    setHighlightedIndex(originChatIndexByGrouped);
    // console.log(groupedChatsRefs.current);
  };
  useConsole("CURRENTCHATS", chats);
  useConsole("CHAT_LENGTH", chats.length !== 0);
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
      <InputWrapper>
        <Input onKeyDown={inputHandler} />
        <CircleButton>
          <SendSvg />
        </CircleButton>
      </InputWrapper>
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
const InputWrapper = styled(HorizontalWrapper)`
  margin-top: 12px;
  height: 42px;
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 18px;
  box-sizing: border-box;
  border-radius: 50px;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.7);
  border: none;
  outline: none;
  display: block;
  height: 42px;
  background-color: #efefef;
`;

const CircleButton = styled.div`
  border: none;
  outline: none;
  width: 48px !important;
  display: block;
  padding: 0px;
  border-radius: 50px;
  margin-left: 12px;
  background-color: #fff;
  color: #849e9b;
  text-align: center;
  line-height: 48px;
`;

const FullInfo = styled.div`
  font-weight: 700;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  padding-top: 24px;
  flex: 1;
`;
