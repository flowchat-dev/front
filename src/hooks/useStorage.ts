import { useState, useEffect, Dispatch, SetStateAction } from "react";
const useStorage = <T>(storageKey: string) => {
  const [data, setData] = useState<T>();

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    console.log(storageKey, stored);
    if (stored) {
      try {
        console.log("The Stored key is...", stored);
        setData(JSON.parse(stored));
      } catch {
        console.log("Error Parsing Stored Data.");
        localStorage.setItem(storageKey, "null");
      }
    } else {
      console.log("Error Parsing Stored Data.");
      localStorage.setItem(storageKey, "null");
    }
  }, [storageKey]);
  return [
    data,
    (...e) => {
      setData(...e);
      localStorage.setItem(storageKey, JSON.stringify(...e));
    },
  ] as [T, Dispatch<SetStateAction<undefined | T>>];
};

export default useStorage;
