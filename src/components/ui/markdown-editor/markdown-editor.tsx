import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Bold,
  Italic,
  Code,
  FileCode,
  Link2,
  Table,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "generic-ds";
import classNames from "classnames";

import "./markdown-editor.scss";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  action: (text: string) => {
    text: string;
    selectionStart: number;
    selectionEnd: number;
  };
}

const toolbar: ToolbarButton[] = [
  {
    icon: <Bold size={14} />,
    label: "Bold",
    action: (text: string) => ({
      text: `**${text}**`,
      selectionStart: 2,
      selectionEnd: text.length + 2,
    }),
  },
  {
    icon: <Italic size={14} />,
    label: "Italic",
    action: (text: string) => ({
      text: `*${text}*`,
      selectionStart: 1,
      selectionEnd: text.length + 1,
    }),
  },
  {
    icon: <Code size={14} />,
    label: "Inline Code",
    action: (text: string) => ({
      text: `\`${text}\``,
      selectionStart: 1,
      selectionEnd: text.length + 1,
    }),
  },
  {
    icon: <FileCode size={14} />,
    label: "Code Block",
    action: (text: string) => ({
      text: `\`\`\`\n${text}\n\`\`\``,
      selectionStart: 4,
      selectionEnd: text.length + 4,
    }),
  },
  {
    icon: <Link2 size={14} />,
    label: "Link",
    action: (text: string) => ({
      text: `[${text}](url)`,
      selectionStart: 1,
      selectionEnd: text.length + 1,
    }),
  },
  {
    icon: <Table size={14} />,
    label: "Table",
    action: () => ({
      text: `| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |`,
      selectionStart: 2,
      selectionEnd: 8,
    }),
  },
  {
    icon: <List size={14} />,
    label: "Bullet List",
    action: (text: string) => ({
      text: `- ${text}`,
      selectionStart: 2,
      selectionEnd: text.length + 2,
    }),
  },
  {
    icon: <ListOrdered size={14} />,
    label: "Numbered List",
    action: (text: string) => ({
      text: `1. ${text}`,
      selectionStart: 3,
      selectionEnd: text.length + 3,
    }),
  },
];

export default function MarkdownEditor({
  value,
  onChange,
  height = 400,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(value);
  const [prefersDarkTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(
    null
  );

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleToolbarAction = (action: ToolbarButton["action"]) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = content.substring(start, end) || "";

    const { text, selectionStart, selectionEnd } = action(selectedText);

    const newContent =
      content.substring(0, start) + text + content.substring(end);

    handleChange(newContent);

    // Set cursor position after update
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        textareaRef.setSelectionRange(
          start + selectionStart,
          start + selectionEnd
        );
      }
    }, 0);
  };

  const handleChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);

    // Add to history
    const newHistory = [...history.slice(0, historyIndex + 1), newContent];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousContent = history[historyIndex - 1];
      setContent(previousContent);
      onChange(previousContent);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextContent = history[historyIndex + 1];
      setContent(nextContent);
      onChange(nextContent);
    }
  };

  return (
    <div className="markdown-editor" style={{ height }}>
      <div className="toolbar">
        <div className="toolbar-group">
          <Button
            variant="ghost"
            size="small"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            icon={<Undo size={14} />}
          />
          <Button
            variant="ghost"
            size="small"
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            icon={<Redo size={14} />}
          />
        </div>

        <div className="divider" />

        <div className="toolbar-group">
          {toolbar.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="small"
              onClick={() => handleToolbarAction(item.action)}
              title={item.label}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      <div className="editor-container">
        <div className="editor-pane">
          <textarea
            ref={ref => setTextareaRef(ref)}
            value={content}
            onChange={e => handleChange(e.target.value)}
            className="editor-textarea"
            placeholder="Write your markdown here..."
            spellCheck={false}
          />
        </div>

        <div className="preview-pane">
          <ReactMarkdown
            components={{
              code({
                node,
                inline,
                className,
                children,
                ...props
              }: {
                node?: any;
                inline?: boolean;
                className?: string;
                children?: React.ReactNode;
              }) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";

                return !inline && language ? (
                  <div className="code-block">
                    <div className="code-header">{language}</div>
                    <SyntaxHighlighter
                      style={prefersDarkTheme ? materialDark : materialLight}
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
                  <code
                    className={classNames("inline-code", className)}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
