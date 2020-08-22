import { IUser } from "../types/commonType";
import { ILocalUser } from "../types/interface";
import api from "../functions/api";

let users: ILocalUser[] = [];

const saveLocal = (): void => {
  // console.log(users)
  localStorage.setItem("users", JSON.stringify(users));
};
const updateFromLocal = (): void => {
  let localRawData = localStorage.getItem("users");
  // console.log(localRawData)
  if (!localRawData) {
    console.log("create new localdb..");
    localRawData = "[]";
    saveLocal();
  }
  users = JSON.parse(localRawData);
};

export const get = async (
  userId: string,
  channelId: string
): Promise<ILocalUser> => {
  updateFromLocal();
  // update()
  const localQuery = users.filter((e) => e.id === userId)[0];

  if (localQuery?.expired > +new Date()) {
    return localQuery;
  }

  console.log("getting user data from api..");
  const fetched = await api(
    `user/getUserInfoByUserId?channelId=${channelId}&userId=${userId}`,
    {
      method: "get",
    }
  );
  const userInfo = {
    ...((await fetched.json()) as IUser),
    expired: +new Date() + 3600000,
  };
  updateFromLocal();
  if (localQuery || users.filter((e) => e.id === userId)[0]?.id) {
    users = [...users.filter((e) => e.id !== userInfo.id), userInfo];
  } else {
    users = [...users, userInfo];
  }
  // users = users.map()
  saveLocal();
  return userInfo;
};

export default {
  get,
};
