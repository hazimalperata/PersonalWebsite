'use client'

import {useCallback, useRef, useState} from "react";

type Props = {
  file: string;
}

export default function AccountPicker(props: Props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const spanRef = useRef<HTMLSpanElement>(null);

  const separator = "=========== List By TheFry =============="

  const onClickButton = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const accountList = props.file.split(separator);
    if (spanRef.current) {
      const randomAccountText = accountList[Math.floor(Math.random() * accountList.length)];
      spanRef.current.innerText = randomAccountText;
      const parsedList = randomAccountText.split("\r\n");
      const userNameText = parsedList[2];
      const passwordText = parsedList[3];
      setUserName(userNameText.split(" = ")[1]);
      setPassword(passwordText.split(" = ")[1]);
    }
    setIsProcessing(false);
  }, [isProcessing, props.file]);

  return (
    <div className="flex flex-col gap-y-5 bg-slate-700 rounded-xl p-8 shadow-2xl max-w-screen-2xl">
      <button disabled={isProcessing} onClick={onClickButton} className="py-2 px-4 bg-slate-500 rounded-full hover:scale-105 transition-all duration-200">
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