import React from "react";
import styled from "@emotion/styled";

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
}
interface IImageItemProps {
  image: string;
}

interface IFileItemProps {
  sizeString: string;
  name: string;
}
const FileItem: React.FC<IFileItemProps> = ({ name, sizeString }) => {
  return (
    <ItemWrapper>
      <FileWrapper>
        <ImageIconWrapper>
          <Remove />
        </ImageIconWrapper>
        <FileName>{name}</FileName>
        <FileSize>{sizeString}</FileSize>
      </FileWrapper>
    </ItemWrapper>
  );
};
const ImageItem: React.FC<IImageItemProps> = ({ image }) => {
  return (
    <ItemWrapper>
      <ImageIconWrapper>
        <Remove />
      </ImageIconWrapper>
      <Image src={image} />
    </ItemWrapper>
  );
};
const FileViewer: React.FC<IProps> = ({ files }) => {
  return (
    <Wrapper>
      {Array.from(files).map((e) => {
        if (e.type.includes("image"))
          return <ImageItem image={window.URL.createObjectURL(e)} />;
        else if (["pdf"].includes(e.type.split("/")[1]))
          return (
            <FileItem name={e.name} sizeString={getFormattedSize(e.size)} />
          );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  right: 24px;
  bottom: 90px;
`;

const ItemWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  & + & {
    margin-top: 12px;
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
  margin: 0px 0px -24px auto;
  background-color: white;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  z-index: 3;
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
