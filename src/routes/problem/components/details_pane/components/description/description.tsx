import _ from "lodash";
import { useState } from "react";
import { Button, Collapse, Tag } from "antd";
import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  TagIcon,
  Lightbulb,
  Star,
} from "lucide-react";

import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { Hint, Problem, Topic } from "@/generated/graphql";
import { tagStyle } from "@/lib/styles";

import "./description.scss";

type Props = {
  problem: Problem;
  loading: boolean;
};

const getHintContent = (hint: string) => (
  <div style={{ paddingInlineStart: 24 }}>{hint}</div>
);

const getAccordionData = (hints: Hint[], topics: Topic[]) => {
  const accordionData = hints?.map((hint, index) => ({
    key: hint.id,
    label: <span>Hint {index + 1}</span>,
    children: getHintContent(hint.content ?? ""),
  }));

  accordionData.unshift({
    key: "topics",
    label: <span>Topics</span>,
    children: (
      <div style={{ paddingInlineStart: 24 }}>
        {topics.map(topic => (
          <Tag key={topic.id} color="default" variant="solid">
            {topic.name}
          </Tag>
        ))}
      </div>
    ),
  });

  return accordionData;
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

  const hints = _.get(problem, "hints", []) as Hint[];
  const topics = _.get(problem, "topics", []) as Topic[];

  if (loading) {
    return <div className="problem">Loading...</div>;
  }

  let chipColor: "neutral" | "green" | "gold" | "red" = "neutral";

  if (problem?.difficulty === "EASY") chipColor = "green";
  if (problem?.difficulty === "MEDIUM") chipColor = "gold";
  if (problem?.difficulty === "HARD") chipColor = "red";

  return (
    <div className="problem">
      <div className="problem_details">
        <h1 className="problem_title">{problem?.title}</h1>

        <div className="problem_metadata">
          <Tag color={chipColor} variant="solid">
            {_.capitalize(problem.difficulty as string)}
          </Tag>

          <Tag icon={<TagIcon size={12} />} style={tagStyle}>
            Topics
          </Tag>

          <Tag icon={<Lightbulb size={12} />} style={tagStyle}>
            Hint
          </Tag>

          <Tag icon={<Eye size={12} />} style={tagStyle}>
            {problem?.views}
          </Tag>
        </div>

        <div className="problem_description">
          <MarkdownRenderer content={problem?.description ?? ""} />
        </div>

        <div className="problem_examples">
          {problem?.examples?.map((example, index: number) => (
            <div key={example?.id}>
              <div className="example_heading">Example {index + 1}:</div>

              <div key={example?.id} className="example_fields">
                <pre>
                  <strong>Input: </strong>
                  {example?.input}
                </pre>

                <pre>
                  <strong>Output: </strong>
                  {example?.input}
                </pre>

                {example?.explanation ? (
                  <pre>
                    <strong>Explanation: </strong>
                    {example.explanation}
                  </pre>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <Collapse
          accordion
          items={getAccordionData(hints, topics)}
          bordered={false}
        />
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

        <Button variant="dashed" icon={<Star size={14} />} />
      </div>
    </div>
  );
};

export default Description;
