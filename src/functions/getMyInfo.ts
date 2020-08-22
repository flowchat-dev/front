import { MY_INFO_STORAGE_KEY } from "../hooks/useMyInfo";
import { IUser } from "../types/commonType";
import api from "./api";

const getMyInfo = async (): Promise<IUser | undefined> => {
  try {
    const stored = localStorage.getItem(MY_INFO_STORAGE_KEY);
    if (!stored) throw new Error();
    const parsed = JSON.parse(stored);
    if (parsed.id) return parsed;
  } catch (e) {
    const myInfo = await (await api("user/me")).json();
    localStorage.setItem(MY_INFO_STORAGE_KEY, JSON.stringify(myInfo));
    console.log(myInfo);
    return await myInfo;
  }
};

export default getMyInfo;
