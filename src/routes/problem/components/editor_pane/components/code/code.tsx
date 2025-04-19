import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button, Select } from "generic-ds";

import "./code.scss";

import Editor from "@monaco-editor/react";

type Props = {
  loading: boolean;
  defaultCode?: string;
  defaultLanguage?: string;
};

// Initial template for the Two Sum problem
const initialCode = `def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your solution here
    pass`;

const Code = ({ loading, defaultCode, defaultLanguage }: Props) => {
  const [language, setLanguage] = useState(defaultLanguage || "python");
  const [code, setCode] = useState(defaultCode || initialCode);

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

  useEffect(() => {
    if (defaultCode && defaultLanguage) {
      setCode(defaultCode);
      setLanguage(defaultLanguage);
    }
  }, [defaultCode, defaultLanguage]);

  const handleCodeChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const handleSubmit = () => {
    console.log("Submitting code:", { language, code });
  };

  if (loading) {
    return <div className="code">Loading...</div>;
  }

  return (
    <div className="code">
      <div className="code_editor">
        <Editor
          height="100%"
          defaultLanguage="python"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme={prefersDarkTheme ? "vs-dark" : "light"}
          options={{
            fontFamily: "JetBrains Mono, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            fontSize: 13.5,
            lineHeight: 1.6,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            wrappingStrategy: "advanced",
          }}
        />
      </div>

      <div className="code_toolbar">
        <Select
          value={language}
          onChange={lang => setLanguage(lang)}
          variant="outline"
          color="zinc"
          options={[
            { value: "python", label: "Python" },
            { value: "javascript", label: "JavaScript" },
            { value: "typescript", label: "TypeScript" },
            { value: "java", label: "Java" },
            { value: "cpp", label: "C++" },
          ]}
          placeholder="Select Language"
          direction="top"
        />

        <Button color="green" icon={<Check size={14} />} onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Code;
