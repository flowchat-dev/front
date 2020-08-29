import { socket } from "../storage/socket";
import { IChat, ISendingChat } from "../types/commonType";
import getMyInfo from "./getMyInfo";
import api from "./api";

const sendMessage = async (
  channelId: string,
  message: string,
  attach?: {
    file?: FileList;
    removedFiles: string[];
  }
) => {
  const { id } = (await getMyInfo()) || { id: undefined };
  console.log(id);
  if (!id) return;
  console.log({ text: message, channelId });
  const body = new FormData();

  if (attach?.file)
    new Array(attach.file.length).fill(undefined).forEach((e, i) => {
      const item = attach.file?.item(i);
      if (item && !attach.removedFiles.includes(item.name))
        body.append("attachment", item);
    });

  Object.entries({
    text: message,
    channelId,
  }).forEach((e) => body.append(...e));

  api("chat/send", {
    body,
    method: "POST",
  });
};
export default sendMessage;
