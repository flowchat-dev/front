import React, { useCallback, useEffect, useRef, useState } from "react";
import { IGroupedChatWithSenderInfo } from "./ChatSide";
import ChatByPerson from "./ChatByPerson";
import styled from "@emotion/styled";
import css from "@emotion/css";

interface IProps {
  data: IGroupedChatWithSenderInfo;
}

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
const VirtualizedChatList: React.FC<IProps> = ({ data }) => {
  console.log(data, data[0]);
  const scrollArea = useRef<HTMLDivElement>(null);
  const [virtualOffset, setVirtualOffset] = useState(1);
  const scrollBottom = useRef(1);
  const scrollHandler = useCallback(
    (e) => {
      const { target } = e;
      scrollBottom.current = target.scrollHeight - target.scrollTop;
      console.log(target.scrollTop);
      if (target?.scrollTop < 200) {
        target.scrollTo({
          y:
            target.scrollHeight -
            scrollBottom.current +
            target.offsetHeight -
            250,
          behavior: "auto",
        });
        setVirtualOffset((beforeVirtualOffset) => beforeVirtualOffset + 1);
      }
    },
    [scrollBottom]
  );
  useEffect(() => {
    scrollArea.current?.addEventListener("scroll", scrollHandler);
    if (scrollArea.current?.offsetHeight)
      scrollBottom.current = scrollArea.current?.offsetHeight;
  }, [scrollArea, scrollHandler, scrollBottom]);
  return (
    <>
      <ChatListWrapper ref={scrollArea}>
        {data.slice(-20 * virtualOffset).map((e) => (
          <ChatByPerson {...e} key={e.chats.map((e) => e.chatId).join("")} />
        ))}
        <div
          id="bottom"
          css={css`
            overflow-anchor: auto;
            height: 1px;
          `}
        />
      </ChatListWrapper>
    </>
  );
};

export default VirtualizedChatList;
