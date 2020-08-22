import useStorage from "./useStorage"
import { useEffect } from "react"
import { IUser } from "../types/commonType"

export const MY_INFO_STORAGE_KEY = 'MYINFO'

const useMyInfo = () => {
  const [myInfo, setMyInfo] = useStorage<IUser | undefined>(MY_INFO_STORAGE_KEY)
  useEffect(() => {
    if (myInfo) return 
    // TODO: LOGIN LOGIC
    setMyInfo({
      "id": "286305948",
      "name": "정한 (부계)",
      "profileImage": "http://p.talk.kakao.co.kr/talkp/wlKf9IN8ZK/PTlNxgdbaobbMRqjYRsYvK/65qv67.jpg"
    })
  }, [myInfo, setMyInfo])
  return myInfo
}
export default useMyInfo