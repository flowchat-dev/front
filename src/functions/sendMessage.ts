import { socket } from "../storage/socket";
import { IChat, ISendingChat } from "../types/commonType";
import getMyInfo from "./getMyInfo";
import api from "./api";

const sendMessage = async (channelId: string, message: string) => {
  const { id } = (await getMyInfo()) || { id: undefined };
  console.log(id);
  if (!id) return;
  console.log({ text: message, channelId });
  api("chat/send", {
    body: JSON.stringify({
      text: message,
      channelId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
};
export default sendMessage;
