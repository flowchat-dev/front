import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import css from "@emotion/css";
import { IChat, IUser } from "../types/commonType";
import { ProfileImage, HorizontalWrapper } from "../atomics";
import getFormattedTIme from "../functions/getFormattedTIme";
import { ChatType } from "../types/includedInterface";

export type TOnClickReply = (chatId: string) => any;
interface IProps {
  sender: IUser;
  chats: IChat[];
  onClickReply: TOnClickReply;
  isHighlighted: boolean;
}

const Name = styled.p`
  margin: 0px;
  /* display: inline-block; */
  font-size: 15px;
  opacity: 0.8;
  font-weight: 500;
  color: white;
  /* position: sticky;
  top: 4px; */
`;
const ChatByPersonWrapper = styled.div`
  /* display: flex; */
`;
const Sender = styled.span``;
const BubblesWrapper = styled.div`
  /* margin-top: 22px; */
`;
const Bubble = styled.div`
  font-size: 18px;
  padding: 12px 24px;
  background-color: white;
  border-radius: 36px;
  display: inline-block;
  margin-bottom: 6px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
`;
const Time = styled.p`
  font-size: 15px;
  opacity: 0.8;
  color: white;
  display: inline-block;
  margin: 0px 0px 6px 12px;
  vertical-align: bottom;
`;
const StickyContainer = styled.span`
  position: sticky;
  top: 40px;
  word-break: break-all;
`;
const PhotoViewer = styled.img<{ small: boolean }>`
  border-radius: 36px;
  width: 40%;
  ${({ small }) =>
    small &&
    css`
      max-width: 180px;
    `}
`;
const EmoticonViewer = styled.img`
  width: 40%;
`;
const ReplyContainer = styled.div`
  display: flex;
  & + div {
    border-top-left-radius: 0px;
  }
`;
const ReplyBubble = styled.div`
  background-color: white;
  opacity: 0.7;
  padding: 12px;
  border-radius: 24px;
  border-bottom-left-radius: 0px;
  font-size: 15px;
`;
const GoToOrigin = styled.i`
  color: white;
  align-self: center;
  margin-left: 12px;
  & {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 22px;
    height: 22px;
  }
  &::after,
  &::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 4px;
  }
  &::after {
    width: 8px;
    height: 8px;
    border-top: 2px solid;
    border-left: 2px solid;
    transform: rotate(45deg);
    left: 7px;
  }
  &::before {
    width: 2px;
    height: 16px;
    left: 10px;
    background: currentColor;
  }
`;
interface IReplyProps {
  originText: string;
  originId: string;
  onClickReply: TOnClickReply;
}
export const Reply: React.FC<IReplyProps> = ({
  originId,
  originText,
  children,
  onClickReply,
}) => (
  <>
    <ReplyContainer>
      <ReplyBubble>{originText}</ReplyBubble>
      <GoToOrigin onClick={() => onClickReply(originId)} />
    </ReplyContainer>
    <Bubble>{children}</Bubble>
  </>
);

const ChatByPerson = ({
  sender,
  chats,
  onClickReply,
  isHighlighted,
}: IProps & React.HTMLAttributes<HTMLDivElement>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isHighlighted)
      wrapperRef.current?.scrollIntoView({
        behavior: "smooth",
      });
  }, [isHighlighted, chats]);
  return (
    <div ref={wrapperRef}>
      <div>
        <Name>{sender.name}</Name>
      </div>
      <HorizontalWrapper>
        <Sender>
          <StickyContainer>
            <ProfileImage size={48} src={sender.profileImage} />
          </StickyContainer>
        </Sender>
        <BubblesWrapper>
          {chats
            .map((e) => ({
              ...e,
              formattedTime: getFormattedTIme(new Date(e.time)),
            }))
            .map((e, index, wholeChats) => (
              <div key={+e.chatId}>
                {e.attachment?.length ? (
                  e.attachment.map((attachment) => {
                    if (attachment?.type === ChatType.Photo)
                      return (
                        <PhotoViewer
                          src={attachment.url}
                          small={!!e.attachment?.length}
                        />
                      );
                    if (attachment?.type === ChatType.Reply)
                      return (
                        <Reply
                          originText={attachment.originMessage}
                          originId={attachment.originChat}
                          onClickReply={onClickReply}
                        >
                          {e.text}
                        </Reply>
                      );
                    if (attachment?.type === 12)
                      //@ts-ignore
                      return <EmoticonViewer src={attachment.url} />;
                  })
                ) : (
                  <Bubble>{e.text}</Bubble>
                )}

                {wholeChats[index + 1]?.formattedTime ===
                e.formattedTime ? null : (
                  <Time>{e.formattedTime}</Time>
                )}
              </div>
            ))}
        </BubblesWrapper>
      </HorizontalWrapper>
    </div>
  );
};

export default ChatByPerson;
