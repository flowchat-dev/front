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
  const scrollArea = useRef<HTMLDivElement>(null);

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
          <ChatListWrapper ref={scrollArea}>
            <VirtualizedChatList data={groupedWithSender} />
            <div
              id="bottom"
              css={css`
                overflow-anchor: auto;
                height: 1px;
              `}
            />
          </ChatListWrapper>
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
const ChatListWrapper = styled.div`
  background-color: #849e9b;
  flex: 1;
  padding: 20px 20px 12px 20px;
  border-radius: 24px 0px 0px 24px;
  overflow-y: scroll;
  scroll-behavior: smooth;
  & * {
    overflow-anchor: none;
  }
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
