import { useEffect } from "react";

const WHITELIST = ["DISAPPEAR?"];

const useConsole = (name: string, value: any) => {
  useEffect(() => {
    if (WHITELIST.includes(name)) console.log(name, value);
  }, [name, value]);
};

export default useConsole;
