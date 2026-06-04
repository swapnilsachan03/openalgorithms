import _ from "lodash";
import { useState } from "react";
import { Beaker, BookOpen, NotepadText } from "lucide-react";

import { Problem } from "@/generated/graphql";

import "./details_pane.scss";
import PaneHeader from "../pane_header/pane_header";
import Description from "./components/description";
import Editorial from "./components/editorial";
import Solutions from "./components/solutions";

type Props = {
  problem: Problem;
  loading: boolean;
};

const getPaneTabs = (setSelectedTab: (tab: string) => void) => {
  const tabs = [
    {
      key: "description",
      icon: <NotepadText size={16} color="cyan" />,
      onTabClick: () => setSelectedTab("description"),
    },
    {
      key: "editorial",
      icon: <BookOpen size={16} color="magenta" />,
      onTabClick: () => setSelectedTab("editorial"),
    },
    {
      key: "solutions",
      icon: <Beaker size={16} color="green" />,
      onTabClick: () => setSelectedTab("solutions"),
      isVisible: false,
    },
  ];

  return _.filter(tabs, tab => _.get(tab, "isVisible", true));
};

const DetailsPane = ({ problem, loading }: Props) => {
  const [selectedTab, setSelectedTab] = useState("description");

  const tabs = getPaneTabs(setSelectedTab);

  if (loading) {
    return (
      <div className="details_pane">
        <PaneHeader tabs={tabs} selectedTab={selectedTab} />
        Loading...
      </div>
    );
  }

  const renderPaneContent = () => {
    switch (selectedTab) {
      case "description":
        return <Description problem={problem} loading={loading} />;
      case "editorial":
        return <Editorial problem={problem} loading={loading} />;
      case "solutions":
        return <Solutions problem={problem} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="details_pane">
      <PaneHeader tabs={tabs} selectedTab={selectedTab} />
      <div className="details_pane_content">{renderPaneContent()}</div>
    </div>
  );
};

export default DetailsPane;
