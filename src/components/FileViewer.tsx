import React, { useState } from "react";
import styled from "@emotion/styled";
import css from "@emotion/css";
import { AVAILABLE_FILE_FORMAT } from "../types/constants";

const getFormattedSize = (bytes: number) => {
  let modifiable = bytes;
  let suffixCounter = 0;
  while (modifiable > 1024) {
    modifiable /= 1024;
    suffixCounter++;
  }
  return `${modifiable.toFixed(2)}${["B", "KB", "MB", "GB"][suffixCounter]}`;
};
interface IProps {
  files: FileList;
  onClickRemove: (filename: string) => any;
  removeFiles?: string[];
  fileViewerOpened: boolean;
}

interface IItem {
  remove: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
  disappear: boolean;
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
}> = ({ children, onClick, disappear }) => {
  const [disappearing, setDisappearing] = useState<boolean>(false);
  const clickHanlder = () => {
    setDisappearing(true);
    onClick && setTimeout(onClick, 300);
  };
  return (
    <ItemWrapper disappearing={(disappearing || disappear) && 300}>
      {children}
      <ImageIconWrapper onClick={clickHanlder}>
        <Remove />
      </ImageIconWrapper>
    </ItemWrapper>
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
    <AttachItem onClick={remove} disappear={disappear}>
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
          if (e.type.includes("image"))
            return (
              <ImageItem
                remove={() => onClickRemove(e.name)}
                image={window.URL.createObjectURL(e)}
                disappear={!fileViewerOpened}
              />
            );
          else if (e.name.substr(e.name.lastIndexOf(".") + 1))
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

const ItemWrapper = styled.div<{ disappearing: false | number }>`
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  animation: appear 500ms cubic-bezier(0, 0.91, 0, 0.97);
  margin-top: 12px;
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
const Image = styled.img`
  width: 180px;
  border-radius: 12px;
  vertical-align: middle;
  user-select: none;
`;
const ImageIconWrapper = styled.div`
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
  padding: 6px 6px 6px 12px;
`;
export default FileViewer;
