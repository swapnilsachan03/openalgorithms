/**-- external --*/

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button, Select } from "antd";
import Editor, { type Monaco } from "@monaco-editor/react";
import { useMutation } from "@apollo/client/react";

/**-- relative --*/

import { createSubmissionMutation } from "../../modules/mutations";
import { handleCreateSubmission } from "../../modules/services";
import { languageOptions } from "../../modules/utils";

import "./code.scss";

type Props = {
  problemId: string;
  loading: boolean;
  defaultCode?: string;
  defaultLanguage?: string;
  goToSubmissions: () => void;
};

const Code = ({
  problemId,
  loading,
  defaultCode,
  defaultLanguage,
  goToSubmissions,
}: Props) => {
  const [language, setLanguage] = useState(defaultLanguage || "python");
  const [code, setCode] = useState(defaultCode || "");

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

  const [createSubmission, { loading: isSubmitting }] = useMutation(
    createSubmissionMutation
  );

  const handleCodeChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const handleSubmit = async () => {
    await handleCreateSubmission(
      code,
      language,
      problemId,
      createSubmission,
      goToSubmissions
    );
  };

  if (loading) {
    return <div className="code">Loading...</div>;
  }

  // eslint-disable-next-line
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#141414",
      },
    });

    if (prefersDarkTheme) {
      monaco.editor.setTheme("custom-dark");
    }
  };

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
          onMount={handleEditorDidMount}
        />
      </div>

      <div className="code_toolbar">
        <Select
          placeholder="Select Language"
          value={language}
          onChange={setLanguage}
          options={languageOptions}
        />

        <Button
          variant="solid"
          color="green"
          icon={<Check size={14} />}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Code;
