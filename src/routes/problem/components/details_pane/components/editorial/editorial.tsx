import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ThumbsUp, ThumbsDown, Eye, Calendar } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import dayjs from "dayjs";

import "./editorial.scss";
import { Chip } from "generic-ds";

type Props = {
  data: any;
  loading: boolean;
};

const Editorial = ({ data, loading }: Props) => {
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const [prefersDarkTheme, setPrefersDarkTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) =>
      setPrefersDarkTheme(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleLike = () => {
    if (userDisliked) setUserDisliked(false);
    setUserLiked(!userLiked);
  };

  const handleDislike = () => {
    if (userLiked) setUserLiked(false);
    setUserDisliked(!userDisliked);
  };

  // Dummy editorial data for development
  const dummyEditorial = {
    title: "Two Sum - Editorial Solution",
    content: `
## Approach 1: Brute Force

The simplest approach is to check every possible pair of numbers in the array.

\`\`\`python
def twoSum(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
\`\`\`

**Time Complexity:** O(n²)
**Space Complexity:** O(1)

## Approach 2: Hash Table

We can use a hash table to achieve O(n) time complexity:

\`\`\`python
def twoSum(nums, target):
    seen = {}
    for i, value in enumerate(nums):
        remaining = target - value
        if remaining in seen:
            return [seen[remaining], i]
        seen[value] = i
    return []
\`\`\`

**Time Complexity:** O(n)
**Space Complexity:** O(n)

### Why is this better?
The hash table approach is more efficient because we only need to traverse the array once. For each number, we check if its complement exists in our hash table.
    `,
    createdAt: "2023-09-15T10:00:00Z",
    views: 1234,
    likes: 42,
    dislikes: 3,
  };

  const editorial = data?.problem?.editorial || dummyEditorial;

  if (loading) {
    return <div className="editorial">Loading...</div>;
  }

  if (!editorial) {
    return <div className="editorial">No editorial available yet.</div>;
  }

  return (
    <div className="editorial">
      <div className="editorial_details">
        <h1 className="editorial_title">{editorial.title}</h1>

        <div className="editorial_metadata">
          <Chip icon={<Calendar size={13} />} size="small">
            {dayjs(editorial.createdAt).format("MMM DD, YYYY")}
          </Chip>

          <Chip icon={<Eye size={13} />} size="small">
            {editorial.views}
          </Chip>
        </div>

        <div className="editorial_content">
          <ReactMarkdown
            components={{
              code({
                node,
                inline,
                className,
                children,
                ...props
              }: {
                node?: any;
                inline?: boolean;
                className?: string;
                children?: React.ReactNode;
              }) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";

                return !inline && language ? (
                  <div className="code-block">
                    <div className="code-header">{language}</div>
                    <SyntaxHighlighter
                      style={prefersDarkTheme ? materialDark : materialLight}
                      customStyle={{ margin: 0 }}
                      codeTagProps={{
                        style: {
                          fontFamily: "JetBrains Mono",
                          fontSize: "13px",
                        },
                      }}
                      language={language}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {editorial?.content || ""}
          </ReactMarkdown>
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
