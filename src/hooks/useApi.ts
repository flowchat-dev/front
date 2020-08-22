import api, {TApiRequest} from "../functions/api";
import { useState, useEffect } from "react";

const useApi = (type:( |'json'|'text') = 'json', ...config: TApiRequest) => {
  const [data, setData] = useState()
  useEffect(() => {
    (async () => {
      setData(await (await api(...config))[type]())
    })()
  })
  return data
}

export default useApi