import { CheckSquare2, Terminal } from "lucide-react";

import PaneHeader from "../pane_header/pane_header";

type Props = {
  data: any;
  loading: boolean;
};

const tabs = [
  {
    key: "testcases",
    icon: <CheckSquare2 size={16} color="green" />,
    onTabClick: () => {},
  },
  {
    key: "output",
    icon: <Terminal size={16} color="purple" />,
    onTabClick: () => {},
  },
];

const OutputPane = (props: Props) => {
  return (
    <div>
      <PaneHeader tabs={tabs} />
      OutputPane
    </div>
  );
};

export default OutputPane;
