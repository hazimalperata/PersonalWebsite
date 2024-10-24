'use client'

import {useCallback, useEffect, useRef, useState} from "react";
import clsx from "clsx";

export default function AccountPicker() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getRandomAccount = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const response = await fetch('/api/get-file', {cache: "no-store"});
    const result = await response.json();
    if (spanRef.current) {
      spanRef.current.innerText = result.content;
      const parsedList = result.content.split("\n");
      if (parsedList && parsedList.length > 4) {
        const userNameText = parsedList[2];
        const passwordText = parsedList[3];
        setUserName(userNameText.split(" = ")[1]);
        setPassword(passwordText.split(" = ")[1]);
      }
    }
    setIsProcessing(false);
  }, [isProcessing]);

  useEffect(() => {
    const prepareAccounts = async () => {
      const response = await fetch("/api/get-file", {method: 'POST'});
      const result = await response.json();
      if (result.ready) {
        setIsLoading(false);
      }
    };
    prepareAccounts();
  }, []);

  return (
    <div className="flex flex-col gap-y-5 bg-slate-700 rounded-xl p-8 shadow-2xl max-w-screen-2xl">
      <button disabled={isProcessing || isLoading} onClick={getRandomAccount} className={clsx("py-2 px-4 bg-slate-500 rounded-full hover:scale-105 transition-all duration-200", {
        "animate-pulse cursor-wait": isProcessing,
      })}>
        Hesap al
      </button>
      <div className="flex flex-col gap-y-2">
        <div className="cursor-pointer" onClick={() => navigator.clipboard.writeText(userName)}>Kullanıcı Adı: {userName}</div>
        <div className="cursor-pointer" onClick={() => navigator.clipboard.writeText(password)}>Şifre: {password}</div>
      </div>
      <span ref={spanRef} className="bg-gray-400 rounded-lg py-2 px-4">
          </span>
    </div>
  )
}
