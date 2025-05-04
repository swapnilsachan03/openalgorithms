import _ from "lodash";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, Eye, Tag, Lightbulb, Star } from "lucide-react";
import { Collapsible, Chip } from "generic-ds";

import { Problem } from "@/generated/graphql";

import "./description.scss";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

type Props = {
  problem: Problem;
  loading: boolean;
};

const Description = ({ problem, loading }: Props) => {
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

  if (loading) {
    return <div className="problem">Loading...</div>;
  }

  let chipColor: "neutral" | "green" | "yellow" | "red" = "neutral";

  if (problem?.difficulty === "EASY") chipColor = "green";
  if (problem?.difficulty === "MEDIUM") chipColor = "yellow";
  if (problem?.difficulty === "HARD") chipColor = "red";

  return (
    <div className="problem">
      <div className="problem_details">
        <h1 className="problem_title">{problem?.title}</h1>

        <div className="problem_metadata">
          <Chip color={chipColor} size="small">
            {_.capitalize(problem.difficulty as string)}
          </Chip>

          <Chip icon={<Tag size={13} />} size="small">
            Topics
          </Chip>

          <Chip icon={<Lightbulb size={13} />} size="small">
            Hint
          </Chip>

          <Chip icon={<Eye size={13} />} size="small">
            {problem?.views}
          </Chip>
        </div>

        <div className="problem_description">
          <MarkdownRenderer content={problem?.description ?? ""} />
        </div>

        <div className="problem_examples">
          {problem?.examples?.map((example, index: number) => (
            <div key={example?.id}>
              <div className="example_heading">Example {index + 1}:</div>

              <div key={example?.id} className="example_fields_container">
                <pre className="example_field">
                  <strong>Input: </strong>
                  {example?.input}
                </pre>

                <pre className="example_field">
                  <strong>Output: </strong>
                  {example?.input}
                </pre>

                {example?.explanation ? (
                  <pre className="example_field">
                    <strong>Explanation: </strong>
                    {example.explanation}
                  </pre>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="problem_topics">
          {problem?.hints?.map((hint, index: number) => (
            <Collapsible key={index}>
              <Collapsible.Trigger
                chevronPosition="right"
                className="hint_trigger"
              >
                <Tag size={15} />
                Topics
              </Collapsible.Trigger>

              <Collapsible.Content className="hint_content">
                {hint?.content}
              </Collapsible.Content>
            </Collapsible>
          ))}
        </div>

        <div className="problem_hints">
          {problem?.hints?.map((hint, index: number) => (
            <Collapsible key={index}>
              <Collapsible.Trigger
                className="hint_trigger"
                chevronPosition="right"
              >
                <Lightbulb size={16} />
                Hint {index + 1}
              </Collapsible.Trigger>

              <Collapsible.Content className="hint_content">
                {hint?.content}
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
            <ThumbsUp size={14} className="icon" />
            <span className="count">{problem?.likes || 0}</span>
          </button>

          <button
            className={`stat_button ${userDisliked ? "button_disliked" : ""}`}
            onClick={handleDislike}
          >
            <ThumbsDown size={14} className="icon" />
            <span className="count">{problem?.dislikes || 0}</span>
          </button>
        </div>

        <button className="bookmark_button">
          <Star size={16} className="icon" />
        </button>
      </div>
    </div>
  );
};

export default Description;
