import api from "./api";

export const getChatFromDB = async (channelId: string) => await (await api(`chat/${channelId}`)).json()