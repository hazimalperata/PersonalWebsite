"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

export default function AccountPicker() {
  const spanRef = useRef<HTMLSpanElement>(null);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopyDone, setIsCopyDone] = useState(false);

  const getRandomAccount = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/get-file", { cache: "no-store" });
      const result = await response.json();
      if (spanRef.current) {
        spanRef.current.innerText = result.content;
        const parsedList: string[] = result.content.split("\n");
        if (parsedList) {
          const filtered = parsedList.filter((x) => x !== "");
          const userNameText = filtered[1];
          const passwordText = filtered[2];
          setUserName(userNameText.split(" = ")[1]);
          setPassword(passwordText.split(" = ")[1]);
        }
      }
    } catch (e) {
      /* empty */
    }
    setIsProcessing(false);
  }, [isProcessing]);

  const isValidCopy = useMemo(() => {
    if (isCopyDone) return;
    if (userName === "") return;
    if (password === "") return;
    return true;
  }, [isCopyDone, password, userName]);

  const onHandleCopy = useCallback(async () => {
    if (!isValidCopy) return;
    try {
      await navigator.clipboard.writeText([userName, password].join(":"));
      setIsCopyDone(true);
      setTimeout(() => setIsCopyDone(false), 2000);
    } catch (e) {
      console.error(e);
    }
  }, [isValidCopy, password, userName]);

  useEffect(() => {
    const prepareAccounts = async () => {
      const response = await fetch("/api/get-file", { method: "POST" });
      const result = await response.json();
      if (result.ready) {
        setIsLoading(false);
      }
    };
    prepareAccounts();
  }, []);

  return (
    <div className="flex max-w-screen-2xl flex-col gap-y-5 rounded-xl bg-slate-700 p-8 shadow-2xl">
      <button
        disabled={isProcessing || isLoading}
        onClick={getRandomAccount}
        className={clsx(
          "rounded-full bg-slate-500 px-4 py-2 transition-all duration-200 hover:scale-105",
          {
            "animate-pulse cursor-wait": isProcessing,
          },
        )}
      >
        Hesap al
      </button>
      <div className="flex flex-row items-center justify-between gap-5">
        <div className="flex flex-col gap-y-2">
          <div>Kullanıcı Adı: {userName}</div>
          <div>Şifre: {password}</div>
        </div>

        <button
          disabled={!isValidCopy}
          className={clsx("rounded-xl p-2 transition-all duration-200", {
            "bg-gray-400": !isValidCopy,
            "hover:bg-gray-300": isValidCopy,
            "text-white": !isCopyDone,
            "text-green-400": isCopyDone,
          })}
          onClick={onHandleCopy}
        >
          {isCopyDone ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21.5731 4.32992C22.0927 4.81482 22.1453 5.65717 21.6907 6.21135L10.7532 19.5447C10.3003 20.0968 9.5143 20.1549 8.99431 19.6747L2.43182 13.6141C1.90991 13.1321 1.85313 12.29 2.305 11.7333C2.75688 11.1766 3.54629 11.116 4.06821 11.598L9.69062 16.7904L19.8093 4.45534C20.2639 3.90116 21.0536 3.84501 21.5731 4.32992Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      <span ref={spanRef} className="rounded-lg bg-gray-400 px-4 py-2"></span>
      {/*<input type="file" accept="text/plain" onChange={onUploadFile}/>*/}
    </div>
  );
}
