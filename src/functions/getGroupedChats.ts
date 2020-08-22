import { IChat } from "../types/commonType";
import user from "../storage/user";

type IGroupedChatWithSenderId = {
  senderId: string;
  chats: IChat[];
}[];

const getGroupedChats = async (chats: IChat[]) => {
  if (!chats[0]) return;
  let groupedWithSenderId: IGroupedChatWithSenderId = [
    {
      senderId: chats[0].senderId!,
      chats: [chats[0]],
    },
  ];
  chats.slice(1).forEach((e) => {
    if (
      groupedWithSenderId[groupedWithSenderId.length - 1].senderId ===
      e.senderId
    ) {
      groupedWithSenderId[groupedWithSenderId.length - 1].chats = [
        ...groupedWithSenderId[groupedWithSenderId.length - 1].chats,
        e,
      ];
    } else {
      groupedWithSenderId = [
        ...groupedWithSenderId,
        {
          senderId: e.senderId!,
          chats: [e],
        },
      ];
    }
  });
  return await Promise.all(
    groupedWithSenderId.map(async (e) => ({
      chats: e.chats,
      sender: await user.get(e.senderId, e.chats[0].channelId!),
    }))
  );
};

export default getGroupedChats;
