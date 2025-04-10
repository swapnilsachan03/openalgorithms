import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";

import "./code.scss";

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
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "on",
            wrappingStrategy: "advanced",
          }}
        />
      </div>

      <div className="code_toolbar">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="language_select"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <button className="submit_button" onClick={handleSubmit}>
          <Play size={14} />
          Submit
        </button>
      </div>
    </div>
  );
};

export default Code;
