import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import { ReactComponent as BellSvg } from "../assets/notifications-24px.svg";
import { IChat, IChannel } from "../types/commonType";
import { ILocalUser } from "../types/interface";
import ChatInput from "./ChatInput";
import getGroupedChats from "../functions/getGroupedChats";
import VirtualizedChatList from "./VirtualizedList";
import css from "@emotion/css";

interface IProps {
  chats: IChat[];
  channel: IChannel;
}

export type IGroupedChatWithSenderInfo = {
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

  useEffect(() => {
    getGroupedChats(chats).then((e) => e && setGroupedWithSender(e));
  }, [channelId, chats]);

  return (
    <ChatWrapper {...props}>
      <ChannelHeader>
        <ChannelName>{channelName}</ChannelName>
        <IconWrapper>
          <Bell />
        </IconWrapper>
      </ChannelHeader>
      {chats.length !== 0 ? (
        <>
          <VirtualizedChatList data={groupedWithSender} />
          <GotoBottomWrapper>
            <GotoBottomLink>?</GotoBottomLink>
          </GotoBottomWrapper>
        </>
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

const GotoBottomWrapper = styled.div`
  position: fixed;
  right: 24px;
  bottom: 90px;
  background-color: white;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
`;
const GotoBottomLink = styled.a``;
GotoBottomLink.defaultProps = {
  href: "#bottom",
};
