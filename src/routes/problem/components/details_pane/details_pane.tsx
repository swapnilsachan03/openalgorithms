import "./details_pane.scss";
import PaneHeader from "../pane_header/pane_header";
import { Beaker, BookOpen, NotepadText } from "lucide-react";

type Props = {
  data: any;
  loading: boolean;
};

const tabs = [
  {
    key: "description",
    icon: <NotepadText size={16} color="cyan" />,
    onTabClick: () => {},
  },
  {
    key: "editorial",
    icon: <BookOpen size={16} color="magenta" />,
    onTabClick: () => {},
  },
  {
    key: "solutions",
    icon: <Beaker size={16} color="green" />,
    onTabClick: () => {},
  },
];

const DetailsPane = (props: Props) => {
  return (
    <div>
      <PaneHeader tabs={tabs} />
      {props.data?.problem?.title}
    </div>
  );
};

export default DetailsPane;
