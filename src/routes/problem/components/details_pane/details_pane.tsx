import _ from "lodash";
import { useState } from "react";
import { Beaker, BookOpen, NotepadText } from "lucide-react";

import "./details_pane.scss";

import PaneHeader from "../pane_header/pane_header";
import Description from "./components/description";
import Editorial from "./components/editorial";
import Solutions from "./components/solutions";

type Props = {
  data: any;
  loading: boolean;
};

const getPaneTabs = (setSelectedTab: (tab: string) => void) => [
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
  },
];

const DetailsPane = ({ data, loading }: Props) => {
  const [selectedTab, setSelectedTab] = useState("description");

  const tabs = getPaneTabs(setSelectedTab);

  if (loading) {
    return (
      <div className="details_pane">
        <PaneHeader tabs={tabs} />
        Loading...
      </div>
    );
  }

  const renderPaneContent = () => {
    switch (selectedTab) {
      case "description":
        return <Description data={data} loading={loading} />;
      case "editorial":
        return <Editorial data={data} loading={loading} />;
      case "solutions":
        return <Solutions data={data} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="details_pane">
      <PaneHeader tabs={tabs} />
      {renderPaneContent()}
    </div>
  );
};

export default DetailsPane;
