import React from "react";
import styled from "@emotion/styled";
import { IChat, IUser } from "./types/interface";
import { ProfileImage, HorizontalWrapper } from "./atomics";
import getFormattedTIme from "./functions/getFormattedTIme";

interface IProps {
  sender: IUser;
  chats: IChat[];
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
export default ({ sender, chats }: IProps) => (
  <ChatByPersonWrapper>
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
            <div key={+e.time + e.text}>
              <Bubble>{e.text}</Bubble>
              {wholeChats[index + 1]?.formattedTime ===
              e.formattedTime ? null : (
                <Time>{e.formattedTime}</Time>
              )}
            </div>
          ))}
      </BubblesWrapper>
    </HorizontalWrapper>
  </ChatByPersonWrapper>
);
