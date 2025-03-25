import React, { useState } from "react";

import "./pane_header.scss";
import _ from "lodash";

type Tab = {
  key: string;
  icon: React.ReactElement;
  onTabClick: () => void;
};

type Props = {
  tabs: Tab[];
  defaultActiveTab?: string;
};

const PaneHeader = ({ tabs, defaultActiveTab }: Props) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.key);

  return (
    <div className="pane-header">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.key}>
          <div
            className={`tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab.key);
              tab.onTabClick();
            }}
          >
            {tab.icon}
            <span>{_.capitalize(tab.key)}</span>
          </div>

          {index < tabs.length - 1 && <div className="divider" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PaneHeader;
