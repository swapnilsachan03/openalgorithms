import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import {
  materialDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import classNames from "classnames";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import "./markdown-renderer.scss";

type Props = {
  content: string;
};

const MarkdownRenderer = (props: Props) => {
  const { content } = props;

  const [prefersDarkTheme, setPrefersDarkTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) =>
      setPrefersDarkTheme(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="markdown-renderer">
      <ReactMarkdown
        components={{
          code({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "text";

            return !inline && language ? (
              <div className="code-block">
                <div className="code-header">{language}</div>
                <SyntaxHighlighter
                  style={prefersDarkTheme ? materialDark : oneLight}
                  customStyle={{ margin: 0 }}
                  codeTagProps={{
                    style: {
                      fontFamily: "JetBrains Mono",
                      fontSize: "13px",
                    },
                  }}
                  language={language}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={classNames("inline-code", className)} {...props}>
                {children}
              </code>
            );
          },
        }}
        remarkPlugins={[remarkGfm, remarkBreaks]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
