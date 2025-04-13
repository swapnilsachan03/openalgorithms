import _ from "lodash";
import React, { useEffect, useState } from "react";
import classNames from "classnames";

import "./pane_header.scss";

type Tab = {
  key: string;
  icon: React.ReactElement;
  onTabClick: () => void;
};

type Props = {
  tabs: Tab[];
  selectedTab?: string;
};

const PaneHeader = ({ tabs, selectedTab }: Props) => {
  const [activeTab, setActiveTab] = useState(selectedTab);

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  return (
    <div className="pane-header">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.key}>
          <div
            className={classNames("tab", { ["active"]: activeTab === tab.key })}
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
