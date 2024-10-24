'use client'

import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
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
    try {
      const response = await fetch('/api/get-file', {cache: "no-store"});
      const result = await response.json();
      if (spanRef.current) {
        spanRef.current.innerText = result.content;
        const parsedList: string[] = result.content.split("\n");
        if (parsedList) {
          const filtered = parsedList.filter(x => x !== "");
          const userNameText = filtered[2];
          const passwordText = filtered[3];
          setUserName(userNameText.split(" = ")[1]);
          setPassword(passwordText.split(" = ")[1]);
        }
      }
    } catch (e) {
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

  // const separator = "=========== List By TheFry ==============";

  // const onUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     const parsed = await file.text();
  //     const parsedList = parsed.split(separator);
  //
  //     // const tried = parsedList[1].split("\r\n");
  //     // const filtered = tried.filter(x => x !== "");
  //     // console.log(filtered[3].split(" = ")[1]);
  //
  //     let applyList: string[] = [];
  //
  //     parsedList.forEach(x => {
  //       const pars = x.split("\r\n");
  //       const filteredPars = pars.filter(x => x !== "");
  //       if (filteredPars) {
  //         if (Number(filteredPars[3].split(" = ")[1]) >= 10) {
  //           applyList.push(x);
  //         }
  //       }
  //     });
  //
  //     // const result = applyList.join(separator + "\r\n");
  //
  //     const newList = applyList.flatMap(e => [e, (separator + "\r")]).slice(0, -1);
  //
  //     const blob = new Blob(newList, {type: "text/plain"});
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.download = "deneme.txt";
  //     link.href = url;
  //     link.click();
  //     link.remove();
  //     URL.revokeObjectURL(url);
  //
  //     console.log(parsedList.length, applyList.length);
  //   }
  // }

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
      {/*<input type="file" accept="text/plain" onChange={onUploadFile}/>*/}
    </div>
  )
}
