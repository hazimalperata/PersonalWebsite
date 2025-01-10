export default function writeToClipboard(
  text: string,
  setIsCopied: (bol: boolean) => void,
  timeInMs?: number,
) {
  if (typeof window !== "undefined") {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(
          () => {
            setIsCopied(false);
          },
          timeInMs ? timeInMs : 3000,
        );
      })
      .catch(() => {
        // alert("something went wrong");
      });
  }
}
