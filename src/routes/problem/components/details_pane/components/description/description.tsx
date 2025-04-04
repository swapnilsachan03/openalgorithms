import _ from "lodash";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, Eye, Tag, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

import "./description.scss";

import Collapsible from "@/components/ui/collapsible";
import Chip from "@/components/ui/chip";

type Props = {
  data: any;
  loading: boolean;
};

const Description = ({ data, loading }: Props) => {
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const handleLike = () => {
    if (userDisliked) setUserDisliked(false);
    setUserLiked(!userLiked);
  };

  const handleDislike = () => {
    if (userLiked) setUserLiked(false);
    setUserDisliked(!userDisliked);
  };

  const problem = data?.problem;

  if (loading) {
    return <div className="problem">Loading...</div>;
  }

  return (
    <div className="problem">
      <div className="problem_details">
        <h1 className="problem_title">{problem?.title}</h1>

        <div className="problem_metadata">
          <Chip className={`tag_${problem?.difficulty}`}>
            {_.capitalize(problem?.difficulty)}
          </Chip>

          <Chip icon={<Tag size={13} />}>Topics</Chip>
          <Chip icon={<Lightbulb size={13} />}>Hint</Chip>
          <Chip icon={<Eye size={13} />}>{problem?.views}</Chip>
        </div>

        <div className="problem_description">
          <ReactMarkdown>{problem?.description || ""}</ReactMarkdown>
        </div>

        <div className="problem_examples">
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

        <div className="problem_topics">
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

        <div className="problem_hints">
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

      <div className="problem_footer">
        <div className="like_dislike_container">
          <button
            className={`stat_button ${userLiked ? "button_liked" : ""}`}
            onClick={handleLike}
          >
            <ThumbsUp size={16} className="icon" />
            <span className="count">{problem?.likes || 0}</span>
          </button>

          <button
            className={`stat_button ${userDisliked ? "button_disliked" : ""}`}
            onClick={handleDislike}
          >
            <ThumbsDown size={16} className="icon" />
            <span className="count">{problem?.dislikes || 0}</span>
          </button>
        </div>

        <button className="bookmark_button">
          <span className="bookmark_icon" />
          Bookmark
        </button>
      </div>
    </div>
  );
};

export default Description;
