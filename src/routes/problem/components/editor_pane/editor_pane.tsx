import { useState } from "react";
import { Brackets, TimerReset } from "lucide-react";

import "./editor_pane.scss";

import PaneHeader from "../pane_header/pane_header";
import Code from "./components/code/code";
import Submissions from "./components/submissions/submissions";

type Props = {
  loading: boolean;
};

const getPaneTabs = (setSelectedTab: (tab: string) => void) => [
  {
    key: "code",
    icon: <Brackets size={16} color="green" />,
    onTabClick: () => setSelectedTab("code"),
  },
  {
    key: "submissions",
    icon: <TimerReset size={16} color="purple" />,
    onTabClick: () => setSelectedTab("submissions"),
  },
];

const EditorPane = ({ loading }: Props) => {
  const [selectedTab, setSelectedTab] = useState("code");
  const [currentCode, setCurrentCode] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("python");

  const tabs = getPaneTabs(setSelectedTab);

  const handleCopyToEditor = (code: string, language: string) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
    setSelectedTab("code");
  };

  const renderPaneContent = () => {
    switch (selectedTab) {
      case "code":
        return (
          <Code
            loading={loading}
            defaultCode={currentCode}
            defaultLanguage={currentLanguage}
          />
        );
      case "submissions":
        return (
          <Submissions loading={loading} onCopyToEditor={handleCopyToEditor} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="editor">
      <PaneHeader tabs={tabs} selectedTab={selectedTab} />
      {renderPaneContent()}
    </div>
  );
};

export default EditorPane;
