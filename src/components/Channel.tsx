import React from "react";
import styled from "@emotion/styled";
import css from "@emotion/css";
import { IChannel } from "../types/commonType";
import getFormattedTIme from "../functions/getFormattedTIme";
import { HorizontalWrapper, ProfileImage } from "../atomics";
import ellipsisify from "../functions/ellipsisify";

const Title = styled.p`
  font-size: 15px;
  margin: 0px;
  font-weight: 700;
  vertical-align: middle;
`;

const LastMessage = styled.p`
  font-size: 15px;
  margin: 0px;
  opacity: 0.7;
  width: 300px;
`;

const Time = styled.p`
  font-size: 12px;
  opacity: 0.5;
  margin: 0px;
  flex: 1;
  text-align: right;
  line-height: 32px;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const Wrapper = styled(HorizontalWrapper)`
  margin: 6px;
`;

const ImageWrapper = styled.div`
  padding: 6px;
  box-sizing: content-box;
  width: 78px;
  height: 78px;
  /* display: flex; */
`;
const OverlappedProfiles = ({ url }: { url: string[] }) => (
  <>
    {url.map((e, i) => (
      <ProfileImage
        css={css`
          /* width */
          margin: 3px;
        `}
        size={30}
        src={e}
        key={e}
      />
    ))}
  </>
);
export default ({
  profileImage,
  name,
  lastMessage,
  ...props
}: IChannel & React.HTMLAttributes<HTMLDivElement>) => (
  <Wrapper {...props}>
    <ImageWrapper>
      {typeof profileImage === "object" ? (
        <OverlappedProfiles url={profileImage} />
      ) : (
        <ProfileImage
          src={
            profileImage ||
            "https://w.namu.la/s/b00e6e45758110c625b94e12050812965690f4b07d8f6af6356577c52a95d624554e70e51dc584f8089ecc40490d21f48bf98d85900585a3fb4e15faf0dcab66b29357c5c7f5c24848ceb8435c73b89c4a410e9d0287448a64f2e0517b9193b46a74540e6e3111d48c602d9970f414d0"
          }
        />
      )}
    </ImageWrapper>
    <ContentWrapper>
      {lastMessage && (
        <>
          <HorizontalWrapper>
            <Title>{name}</Title>
            {lastMessage.time ? (
              <Time>{getFormattedTIme(lastMessage.time)}</Time>
            ) : null}
          </HorizontalWrapper>
          {lastMessage.text ? (
            <LastMessage>{ellipsisify(lastMessage.text, 40)}</LastMessage>
          ) : null}
        </>
      )}
    </ContentWrapper>
  </Wrapper>
);
