import { socket } from "../storage/socket";
import { useState, useEffect } from "react";

// socket
const useSocket = <T>(message: string): T => {
  const [data, setData] = useState<T>();
  useEffect(() => {
    socket.on(message, setData)
  }, [message])
  return (data as T)
}
export default useSocket