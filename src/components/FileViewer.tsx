import React, { useState } from "react";
import styled from "@emotion/styled";
import css from "@emotion/css";
import { AVAILABLE_FILE_FORMAT } from "../types/constants";
const unitSuffix = ["B", "KB", "MB", "GB"];
const getFormattedSize = (bytes: number) => {
  let modifiable = bytes;
  let suffixCounter = 0;
  while (modifiable > 1024) {
    modifiable /= 1024;
    suffixCounter++;
  }
  return `${modifiable.toFixed(2)}${unitSuffix[suffixCounter]}`;
};
interface IProps {
  files: FileList;
  onClickRemove: (filename: string) => any;
  removeFiles?: string[];
  fileViewerOpened: boolean;
}

interface IItem {
  remove: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
  disappear: boolean;
  name: string;
}
interface IImageItemProps extends IItem {
  image: string;
}

interface IFileItemProps extends IItem {
  sizeString: string;
  name: string;
}

const AttachItem: React.FC<{
  onClick: (e?: any) => any;
  disappear: boolean;
  noCloseButton?: boolean;
}> = ({ children, onClick, disappear, noCloseButton, ...props }) => {
  const [disappearing, setDisappearing] = useState<boolean>(false);
  const clickHanlder = () => {
    setDisappearing(true);
    onClick && setTimeout(onClick, 300);
  };
  return (
    <ItemWrapper disappearing={(disappearing || disappear) && 300} {...props}>
      {children}
      {noCloseButton || (
        <IconWrapper onClick={clickHanlder}>
          <Remove />
        </IconWrapper>
      )}
    </ItemWrapper>
  );
};

const UnsuuportedItem: React.FC<IItem> = ({ remove, name }) => {
  setTimeout(() => remove(), 2300);
  return (
    <AttachItem
      disappear={false}
      onClick={remove}
      css={unsupportedDisappearStyle}
      noCloseButton
    >
      <FileWrapper>
        <FileName>지원하지 않는 형식</FileName>
        <FileSize>{name}</FileSize>
      </FileWrapper>
    </AttachItem>
  );
};

const FileItem: React.FC<IFileItemProps> = ({
  name,
  sizeString,
  remove,
  disappear,
}) => {
  return (
    <AttachItem onClick={remove} disappear={disappear}>
      <FileWrapper>
        <FileName>{name}</FileName>
        <FileSize>{sizeString}</FileSize>
      </FileWrapper>
    </AttachItem>
  );
};
const ImageItem: React.FC<IImageItemProps> = ({ image, remove, disappear }) => {
  return (
    <AttachItem
      onClick={remove}
      disappear={disappear}
      css={css`
        width: 180px;
      `}
    >
      <Image src={image} />
    </AttachItem>
  );
};
const FileViewer: React.FC<IProps> = ({
  files,
  onClickRemove,
  removeFiles,
  fileViewerOpened,
}) => {
  return (
    <Wrapper>
      {Array.from(files)
        .filter((e) => !removeFiles?.includes(e.name))
        .map((e, index) => {
          if (
            !AVAILABLE_FILE_FORMAT.includes(
              e.name.substr(e.name.lastIndexOf(".") + 1)
            )
          )
            return (
              <UnsuuportedItem
                disappear={false}
                name={e.name}
                remove={() => onClickRemove(e.name)}
              />
            );
          if (e.type.includes("image"))
            return (
              <ImageItem
                name={e.name}
                remove={() => onClickRemove(e.name)}
                image={window.URL.createObjectURL(e)}
                disappear={!fileViewerOpened}
              />
            );
          else
            return (
              <FileItem
                remove={() => onClickRemove(e.name)}
                name={e.name}
                sizeString={getFormattedSize(e.size)}
                disappear={!fileViewerOpened}
              />
            );
        })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  right: 24px;
  bottom: 90px;
  transition: 1s;
  min-width: 180px;
`;
const disappearAnimation = css`
  @keyframes disappear {
    from {
      opacity: 1;
      transform: scale(1);
      max-height: 400px;
    }
    to {
      opacity: 0;
      transform: scale(0.7);
      max-height: 0px;
      margin-top: 0px;
    }
  }
`;
const ItemWrapper = styled.div<{ disappearing: false | number }>`
  border-radius: 12px;
  background-color: white;
  animation: appear 500ms cubic-bezier(0, 0.91, 0, 0.97);
  transition: 300ms cubic-bezier(0, 0.91, 0, 0.97);
  margin: 12px 0px 0px auto;
  ${disappearAnimation}
  ${({ disappearing }) =>
    disappearing &&
    css`
      animation: disappear ${disappearing}ms cubic-bezier(0, 0.91, 0, 0.97);
    `}
  @keyframes appear {
    from {
      transform: scale(0.95);
      opacity: 0.7;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
const Image = styled.img`
  border-radius: 12px;
  vertical-align: middle;
  user-select: none;
  width: 100%;
  transition: 300ms cubic-bezier(0, 0.91, 0, 0.97);
`;
const IconWrapper = styled.div`
  position: relative;
  margin: -24px 0px 0px auto;
  background-color: white;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  z-index: 3;
  &:active {
    transform: scale(0.95);
  }
`;
const Remove = styled.i`
  & {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 0.7));
    width: 22px;
    height: 22px;
    border: 2px solid transparent;
    border-radius: 40px;
  }
  &::after,
  &::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 16px;
    height: 2px;
    background: currentColor;
    transform: rotate(45deg);
    border-radius: 5px;
    top: 8px;
    left: 1px;
  }
  &::after {
    transform: rotate(-45deg);
  }
`;
const FileName = styled.h2`
  font-weight: 900;
  font-size: 15px;
  opacity: 0.8;
`;
const FileSize = styled.p`
  font-size: 12px;
  opacity: 0.7;
`;
const FileWrapper = styled.div`
  padding: 6px 12px;
  transition: 300ms cubic-bezier(0, 0.91, 0, 0.97);
`;
const unsupportedDisappearStyle = css`
  ${disappearAnimation}
  animation:  gradient 2s linear,
              disappear 300ms cubic-bezier(0, 0.91, 0, 0.97) 2s;
  background: linear-gradient(
    90deg,
    #ff9292 0%,
    #ff9292 50%,
    #ffcccc 50%,
    #ffcccc 100%
  );
  background-size: 200% 100%;
  font-weight: 900;
  font-size: 15px;
  opacity: 0.8;
  color: white;
  @keyframes gradient {
    from {
      background-position-x: 100%;
    }
    to {
      background-position-x: 1%;
    }
  }
`;
export default FileViewer;
