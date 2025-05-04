import { useState } from "react";
import { ThumbsUp, ThumbsDown, Eye, Calendar } from "lucide-react";
import { Chip } from "generic-ds";
import dayjs from "dayjs";

import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { Problem } from "@/generated/graphql";

import "./editorial.scss";

type Props = {
  problem: Problem;
  loading: boolean;
};

const Editorial = ({ problem, loading }: Props) => {
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

  const editorial = problem?.editorial;
  const editorialContent = editorial?.content ?? "";

  if (loading) {
    return <div className="editorial">Loading...</div>;
  }

  if (!editorial) {
    return <div className="editorial">No editorial available yet.</div>;
  }

  return (
    <div className="editorial">
      <div className="editorial_details">
        <h1 className="editorial_title">{editorial?.title}</h1>

        <div className="editorial_metadata">
          <Chip icon={<Calendar size={13} />} size="small">
            {dayjs(editorial.createdAt).format("MMM DD, YYYY")}
          </Chip>

          <Chip icon={<Eye size={13} />} size="small">
            {editorial.views}
          </Chip>
        </div>

        <div className="editorial_content">
          <MarkdownRenderer content={editorialContent} />
        </div>
      </div>

      <div className="editorial_footer">
        <div className="like_dislike_container">
          <button
            className={`stat_button ${userLiked ? "button_liked" : ""}`}
            onClick={handleLike}
          >
            <ThumbsUp size={14} className="icon" />
            <span className="count">{editorial?.likes || 0}</span>
          </button>

          <button
            className={`stat_button ${userDisliked ? "button_disliked" : ""}`}
            onClick={handleDislike}
          >
            <ThumbsDown size={14} className="icon" />
            <span className="count">{editorial?.dislikes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
