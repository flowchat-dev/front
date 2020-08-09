import React, { useState } from "react";
import styled from "@emotion/styled";
import Sidebar from "./Sidebar";
import { IChannel } from "./types/interface";

import useChannels from "./hooks/useChannels";
import ChatSide from "./ChatSide";
import useChats from "./hooks/useChats";

const ApplicationWrapper = styled.div`
  /* padding: 30px; */
  box-sizing: border-box;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

const MinWidthedSidebar = styled(Sidebar)`
  /* width: 300px; */
  padding: 18px 10px 0px 20px;
  box-sizing: content-box;
  overflow: scroll;
  height: 100vh;
`;

const WidthedChat = styled(ChatSide)`
  flex: 1;
  padding: 18px 0px 0px 10px;
  box-sizing: border-box;
  /* overflow: scroll; */
  height: 100vh;
`;
function App() {
  const channels = useChannels();
  const [selectedChannel, selectChannel] = useState<string>();

  const chats = useChats(selectedChannel);

  const channelClickHandler = (channel: IChannel) => selectChannel(channel.id);
  return (
    <ApplicationWrapper>
      {channels && (
        <>
          <MinWidthedSidebar
            channels={channels}
            onChannelClick={channelClickHandler}
          />
          {chats && selectedChannel && selectedChannel ? (
            <WidthedChat
              chats={chats}
              channel={channels.find((e) => e.id === selectedChannel)!}
            />
          ) : null}
        </>
      )}
    </ApplicationWrapper>
  );
}

export default App;
