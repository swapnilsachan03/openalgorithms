import { Brackets, TimerReset } from "lucide-react";
import PaneHeader from "../pane_header/pane_header";

type Props = {
  data: any;
  loading: boolean;
};

const tabs = [
  {
    key: "code",
    icon: <Brackets size={16} color="green" />,
    onTabClick: () => {},
  },
  {
    key: "submissions",
    icon: <TimerReset size={16} color="purple" />,
    onTabClick: () => {},
  },
];

const EditorPane = (props: Props) => {
  return (
    <div>
      <PaneHeader tabs={tabs} />
      EditorPane
    </div>
  );
};

export default EditorPane;
