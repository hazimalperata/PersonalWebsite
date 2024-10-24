'use client'

import {useCallback, useEffect, useRef, useState} from "react";
import {getFile} from "@/components/Picker/PickerServer";

export default function AccountPicker() {
  const [accountsFile, setAccountsFile] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const spanRef = useRef<HTMLSpanElement>(null);

  const separator = "=========== List By TheFry =============="

  const onClickButton = useCallback(async () => {
    if (isProcessing || isLoading) return;
    setIsProcessing(true);
    const accountList = accountsFile.split(separator);
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
  }, [accountsFile, isLoading, isProcessing]);

  useEffect(() => {
    (async () => {
      const file = await getFile();
      setAccountsFile(file);
      setIsLoading(false);
    })()
  }, []);

  return (
    <div className="flex flex-col gap-y-5 bg-slate-700 rounded-xl p-8 shadow-2xl max-w-screen-2xl">
      {isLoading ? (
        <div>
          YÜKLENİYOR...
        </div>
      ) : (
        <>
          <button disabled={isProcessing} onClick={onClickButton} className="py-2 px-4 bg-slate-500 rounded-full hover:scale-105 transition-all duration-200">
            Hesap al
          </button>
          <div className="flex flex-col gap-y-2">
            <div className="cursor-pointer" onClick={() => navigator.clipboard.writeText(userName)}>Kullanıcı Adı: {userName}</div>
            <div className="cursor-pointer" onClick={() => navigator.clipboard.writeText(password)}>Şifre: {password}</div>
          </div>
          <span ref={spanRef} className="bg-gray-400 rounded-lg py-2 px-4">
          </span>
        </>
      )}
    </div>
  )
}
