import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { HorizontalWrapper } from "../atomics";
import { ReactComponent as SendSvg } from "../assets/send-24px.svg";
import { ReactComponent as SendFileSvg } from "../assets/file.svg";
import sendMessage from "../functions/sendMessage";
import css from "@emotion/css";
import FileViewer from "./FileViewer";

const ChatInput = ({ channelId }: { channelId: string }) => {
  const [focused, setFocused] = useState(false);
  const focusHandler = () => setFocused(true);
  const file = document.createElement("input");
  const [fileAttach, setFileAttach] = useState<FileList>();
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);
  const [fileViewerOpened, setFileViewerOpened] = useState(false);
  const fileChangeListener = (files: FileList) => {
    if (!files) return;
    setRemovedFiles([]);
    setFileAttach(files);
    if (!fileViewerOpened) setFileViewerOpened(true);
  };
  const inputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const { currentTarget } = e;
    const message = currentTarget.value;
    currentTarget.value = "";
    sendMessage(channelId, message, {
      file: fileAttach,
      removedFiles,
    });

    setFileViewerOpened(false);
    setTimeout(() => {
      setRemovedFiles([]);
      setFileAttach(undefined);
    }, 300);
  };

  const clickRemoveHandler = (filename: string) => {
    setRemovedFiles((e) => [...e, filename]);
  };

  useEffect(() => {
    file.type = "file";
    file.multiple = true;
    file.addEventListener("change", ({ target }) => {
      if (file.files) fileChangeListener(file.files);
    });
  }, [file]);

  return (
    <InputWrapper>
      {fileAttach && (
        <FileViewer
          fileViewerOpened={fileViewerOpened}
          onClickRemove={clickRemoveHandler}
          files={fileAttach}
          removeFiles={removedFiles}
        />
      )}
      <Input onFocus={focusHandler} onKeyDown={inputHandler} />
      <CircleButton visible={true}>
        <SendFileSvg onClick={() => file.click()} />
      </CircleButton>
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
  & + & {
    margin-left: 0px;
  }
  ${({ visible }) =>
    visible ||
    css`
      width: 0px;
      opacity: 0;
    `}
`;
