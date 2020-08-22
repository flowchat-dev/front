import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { HorizontalWrapper } from "../atomics";
import { ReactComponent as SendSvg } from "../assets/send-24px.svg";
import sendMessage from "../functions/sendMessage";
import css from "@emotion/css";

const ChatInput = ({ channelId }: { channelId: string }) => {
  const inputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const { currentTarget } = e;
    const message = currentTarget.value;
    currentTarget.value = "";
    sendMessage(channelId, message);
  };
  const [focused, setFocused] = useState(false);
  const focusHandler = () => setFocused(true);
  return (
    <InputWrapper>
      <Input onFocus={focusHandler} onKeyDown={inputHandler} />
      <CircleButton visible={focused}>
        <SendSvg />
      </CircleButton>
    </InputWrapper>
  );
};

export default ChatInput;

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

const CircleButton = styled.div<{ visible: boolean }>`
  border: none;
  outline: none;
  width: 48px;
  display: block;
  padding: 0px;
  border-radius: 50px;
  margin-left: 12px;
  background-color: #fff;
  color: #849e9b;
  text-align: center;
  line-height: 48px;
  transition: 300ms cubic-bezier(0, 0.91, 0, 0.97);
  ${({ visible }) =>
    visible ||
    css`
      width: 0px;
      opacity: 0;
    `}
`;
