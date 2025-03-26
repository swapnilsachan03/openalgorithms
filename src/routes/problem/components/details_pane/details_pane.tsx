import _ from "lodash";
import ReactMarkdown from "react-markdown";

import {
  Beaker,
  BookOpen,
  NotepadText,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Eye,
  ChevronRight,
} from "lucide-react";

import "./details_pane.scss";
import "react-loading-skeleton/dist/skeleton.css";

import { useState, useRef, useEffect } from "react";
import PaneHeader from "../pane_header/pane_header";

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
  const [hintsExpanded, setHintsExpanded] = useState(false);
  const hintsContentRef = useRef<HTMLDivElement>(null);
  const [hintsContentHeight, setHintsContentHeight] = useState(0);
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

  useEffect(() => {
    if (hintsContentRef.current) {
      setHintsContentHeight(hintsContentRef.current.scrollHeight);
    }
  }, [data?.problem?.hints]);

  const problem = data?.problem;

  if (loading) {
    return (
      <div className="details-pane">
        <PaneHeader tabs={tabs} />
        Loading...
      </div>
    );
  }

  return (
    <div className="details-pane">
      <PaneHeader tabs={tabs} />
      <div className="details-pane__content">
        <h1 className="details-pane__title">{problem?.title}</h1>

        <div className="details-pane__metadata">
          <span
            className={`details-pane__difficulty details-pane__difficulty--${problem?.difficulty}`}
          >
            {_.capitalize(problem?.difficulty)}
          </span>

          <div className="details-pane__stats">
            <span className="stat-item">
              <Eye size={14} /> {problem?.views}
            </span>
            <div className="separator" />
            <span className="stat-item">
              <Bookmark size={14} /> {problem?.bookmarks}
            </span>
          </div>
        </div>

        <div className="details-pane__description">
          <ReactMarkdown>{problem?.description || ""}</ReactMarkdown>
        </div>

        {problem?.examples?.length > 0 && (
          <div className="details-pane__examples">
            <h2 className="details-pane__examples-title">Examples</h2>
            {problem.examples.map((example: any, index: number) => (
              <div key={example.id} className="details-pane__examples-item">
                <div className="details-pane__examples-item-label">Input:</div>
                <pre className="details-pane__examples-item-content">
                  {example.input}
                </pre>
                <div className="details-pane__examples-item-label">Output:</div>
                <pre className="details-pane__examples-item-content">
                  {example.output}
                </pre>
              </div>
            ))}
          </div>
        )}

        {problem?.hints?.length > 0 && (
          <div className="details-pane__hints">
            <div
              className="details-pane__hints-header"
              onClick={() => setHintsExpanded(!hintsExpanded)}
            >
              <ChevronRight
                size={20}
                className={`icon ${hintsExpanded ? "icon--expanded" : ""}`}
              />
              <h2 className="details-pane__hints-title">
                Hints ({problem.hints.length})
              </h2>
            </div>
            <div
              ref={hintsContentRef}
              className="details-pane__hints-content"
              style={{ height: hintsExpanded ? hintsContentHeight : 0 }}
            >
              <div className="details-pane__hints-list">
                {problem.hints.map((hint: any) => (
                  <div key={hint.id} className="details-pane__hints-item">
                    {hint.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="details-pane__stats--floating">
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
