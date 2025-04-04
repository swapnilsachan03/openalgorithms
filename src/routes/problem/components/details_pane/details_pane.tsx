import _ from "lodash";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  Beaker,
  BookOpen,
  NotepadText,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Tag,
  Lightbulb,
} from "lucide-react";

import "./details_pane.scss";

import PaneHeader from "../pane_header/pane_header";
import Collapsible from "@/components/ui/collapsible";
import Chip from "@/components/ui/chip";

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

const DetailsPane = ({ data, loading }: Props) => {
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const handleLike = () => {
    if (userDisliked) setUserDisliked(false);
    setUserLiked(!userLiked);
    // Add your like API call here
  };

  const handleDislike = () => {
    if (userLiked) setUserLiked(false);
    setUserDisliked(!userDisliked);
    // Add your dislike API call here
  };

  const problem = data?.problem;

  if (loading) {
    return (
      <div className="details_pane">
        <PaneHeader tabs={tabs} />
        Loading...
      </div>
    );
  }

  return (
    <div className="details_pane">
      <PaneHeader tabs={tabs} />

      <div className="details_pane_content">
        <h1 className="problem_title">{problem?.title}</h1>

        <div className="details_pane_metadata">
          <Chip className={`tag_${problem?.difficulty}`}>
            {_.capitalize(problem?.difficulty)}
          </Chip>

          <Chip icon={<Tag size={13} />}>Topics</Chip>
          <Chip icon={<Lightbulb size={13} />}>Hint</Chip>
          <Chip icon={<Eye size={13} />}>{problem?.views}</Chip>
        </div>

        <div className="details_pane_description">
          <ReactMarkdown>{problem?.description || ""}</ReactMarkdown>
        </div>

        <div className="details_pane_examples">
          {problem?.examples?.map((example: any, index: number) => (
            <div>
              <div className="example_heading">Example {index + 1}:</div>

              <div key={example.id} className="example_fields_container">
                <pre className="example_field">
                  <strong>Input: </strong>
                  {example.input}
                </pre>

                <pre className="example_field">
                  <strong>Output: </strong>
                  {example.input}
                </pre>

                <pre className="example_field">
                  <strong>Explanation: </strong>
                  {example.explanation}
                </pre>
              </div>
            </div>
          ))}
        </div>

        <div className="details_pane_topics">
          {problem?.hints?.map((hint: any) => (
            <Collapsible>
              <Collapsible.Trigger className="hint_trigger">
                <Tag size={15} />
                Topics
              </Collapsible.Trigger>

              <Collapsible.Content className="hint_content">
                {hint.content}
              </Collapsible.Content>
            </Collapsible>
          ))}
        </div>

        <div className="details_pane_hints">
          {problem?.hints?.map((hint: any, index: number) => (
            <Collapsible>
              <Collapsible.Trigger className="hint_trigger">
                <Lightbulb size={16} />
                Hint {index + 1}
              </Collapsible.Trigger>

              <Collapsible.Content className="hint_content">
                {hint.content}
              </Collapsible.Content>
            </Collapsible>
          ))}
        </div>
      </div>

      <div className="details_pane_stats--floating">
        <button
          className={`stat-button ${userLiked ? "stat-button--liked" : ""}`}
          onClick={handleLike}
        >
          <ThumbsUp size={16} className="icon" />
          <span className="count">{problem?.likes || 0}</span>
        </button>

        <button
          className={`stat-button ${
            userDisliked ? "stat-button--disliked" : ""
          }`}
          onClick={handleDislike}
        >
          <ThumbsDown size={16} className="icon" />
          <span className="count">{problem?.dislikes || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default DetailsPane;
