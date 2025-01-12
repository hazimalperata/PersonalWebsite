import SyntaxHighlighter from "react-syntax-highlighter";
import {
  tomorrowNightBright,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CodeBlockProps } from "@/components/sanity/CodeBlock/types";
import { useTheme } from "next-themes";
import { Check, ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import writeToClipboard from "@/utils/clipboard";
import { useEffect, useState } from "react";

const CodeBlock = ({ value }: CodeBlockProps) => {
  const { code, language } = value;

  const { resolvedTheme } = useTheme();

  const [isCopied, setIsCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsReady(true);
    }
  }, []);

  if (!isReady) return null;

  return (
    <div className="relative group/copyCode">
      <Button
        size="icon"
        disabled={isCopied}
        variant="secondary"
        className="absolute top-2 right-2 invisible group-hover/copyCode:visible"
        onClick={() => writeToClipboard(code, setIsCopied)}
      >
        {isCopied ? <Check /> : <ClipboardCopy />}
      </Button>
      <SyntaxHighlighter
        wrapLines
        wrapLongLines
        showLineNumbers={true}
        showInlineLineNumbers={true}
        language={language}
        style={resolvedTheme === "light" ? atomOneLight : tomorrowNightBright}
        customStyle={{
          padding: "14px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
