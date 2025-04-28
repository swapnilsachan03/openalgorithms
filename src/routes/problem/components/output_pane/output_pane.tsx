import { useState } from "react";
import { CheckSquare2, Terminal } from "lucide-react";

import "./output_pane.scss";
import PaneHeader from "../pane_header/pane_header";
import Testcases from "./components/testcases/testcases";
import Result from "./components/result/result";

type Props = {
  loading: boolean;
};

const OutputPane = ({ loading }: Props) => {
  const [selectedTab, setSelectedTab] = useState("testcases");

  const tabs = [
    {
      key: "testcases",
      icon: <CheckSquare2 size={16} color="green" />,
      onTabClick: () => setSelectedTab("testcases"),
    },
    {
      key: "result",
      icon: <Terminal size={16} color="purple" />,
      onTabClick: () => setSelectedTab("result"),
    },
  ];

  const renderPaneContent = () => {
    switch (selectedTab) {
      case "testcases":
        return <Testcases loading={loading} />;
      case "result":
        return <Result loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="output">
      <PaneHeader tabs={tabs} selectedTab={selectedTab} />
      <div className="output_content">{renderPaneContent()}</div>
    </div>
  );
};

export default OutputPane;
