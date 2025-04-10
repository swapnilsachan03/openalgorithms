import { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Search,
  ArrowLeft,
  User,
  Clock,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import dayjs from "dayjs";

import "./solutions.scss";

type Props = {
  data: any;
  loading: boolean;
};

// Dummy solutions data for development
const dummySolutions = [
  {
    id: "1",
    title: "Python Hash Table Solution O(n)",
    content: `
## Hash Table Approach

This solution uses a hash table to achieve O(n) time complexity.

\`\`\`python
def twoSum(self, nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
\`\`\`

### Time Complexity: O(n)
### Space Complexity: O(n)

The hash table allows us to look up complements in O(1) time.
    `,
    language: "python",
    createdAt: "2024-03-15T10:00:00Z",
    likes: 156,
    dislikes: 12,
    views: 1234,
    user: {
      id: "user1",
      name: "pythondev",
    },
  },
  {
    id: "2",
    title: "TypeScript Two-Pointer Solution",
    content: `
## Two-Pointer Technique

For a sorted array, we can use two pointers to find the target sum.

\`\`\`typescript
function twoSum(numbers: number[], target: number): number[] {
    let left = 0;
    let right = numbers.length - 1;
    
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) {
            return [left + 1, right + 1];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [];
}
\`\`\`

### Time Complexity: O(n)
### Space Complexity: O(1)

This approach only works if the input array is sorted.
    `,
    language: "typescript",
    createdAt: "2024-03-14T15:30:00Z",
    likes: 89,
    dislikes: 5,
    views: 876,
    user: {
      id: "user2",
      name: "tsexpert",
    },
  },
  {
    id: "3",
    title: "Java Solution with Sorting",
    content: `
## Sorting-based Approach

We can sort the array first and then use two pointers.

\`\`\`java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[][] numsWithIndex = new int[nums.length][2];
        for (int i = 0; i < nums.length; i++) {
            numsWithIndex[i] = new int[] { nums[i], i };
        }
        
        Arrays.sort(numsWithIndex, (a, b) -> a[0] - b[0]);
        
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int sum = numsWithIndex[left][0] + numsWithIndex[right][0];
            if (sum == target) {
                return new int[] { 
                    numsWithIndex[left][1],
                    numsWithIndex[right][1] 
                };
            }
            if (sum < target) left++;
            else right--;
        }
        
        return new int[0];
    }
}
\`\`\`

### Time Complexity: O(n log n)
### Space Complexity: O(n)

This solution maintains the original indices while sorting.
    `,
    language: "java",
    createdAt: "2024-03-13T09:15:00Z",
    likes: 67,
    dislikes: 8,
    views: 543,
    user: {
      id: "user3",
      name: "javamaster",
    },
  },
];

const Solutions = ({ data, loading }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSolution, setSelectedSolution] = useState<
    (typeof dummySolutions)[0] | null
  >(null);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const handleSolutionClick = (solution: (typeof dummySolutions)[0]) => {
    setSelectedSolution(solution);
  };

  const handleBack = () => {
    setSelectedSolution(null);
    setUserLiked(false);
    setUserDisliked(false);
  };

  const handleLike = () => {
    if (userDisliked) setUserDisliked(false);
    setUserLiked(!userLiked);
  };

  const handleDislike = () => {
    if (userLiked) setUserLiked(false);
    setUserDisliked(!userDisliked);
  };

  if (loading) {
    return <div className="solutions">Loading...</div>;
  }

  const filteredSolutions = dummySolutions.filter(solution =>
    solution.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedSolution) {
    return (
      <div className="solution_detail">
        <div className="solution_detail_header">
          <button className="back_button" onClick={handleBack}>
            <ArrowLeft size={16} />
          </button>
          <h2>{selectedSolution.title}</h2>
        </div>

        <div className="solution_detail_main">
          <div className="author_info">
            <User size={14} />
            <span className="author_name">@{selectedSolution.user.name}</span>
            <Clock size={14} />
            <span>
              {dayjs(selectedSolution.createdAt).format("MMM DD, YYYY")}
            </span>
          </div>

          <div className="solution_content">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";
                  return !inline && language ? (
                    <div className="code-block">
                      <div className="code-header">{language}</div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
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
              {selectedSolution.content}
            </ReactMarkdown>
          </div>
        </div>

        <div className="solution_footer">
          <div className="like_dislike_container">
            <button
              className={`stat_button ${userLiked ? "button_liked" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp size={14} />
              <span>{selectedSolution.likes + (userLiked ? 1 : 0)}</span>
            </button>
            <button
              className={`stat_button ${userDisliked ? "button_disliked" : ""}`}
              onClick={handleDislike}
            >
              <ThumbsDown size={14} />
              <span>{selectedSolution.dislikes + (userDisliked ? 1 : 0)}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="solutions">
      <div className="solutions_header">
        <div className="search_container">
          <Search size={16} className="search_icon" />
          <input
            type="text"
            placeholder="Search solutions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search_input"
          />
        </div>

        <button className="add_solution_button">Share your solution</button>
      </div>

      <div className="solutions_list">
        {filteredSolutions.map(solution => (
          <div
            key={solution.id}
            className="solution_card"
            onClick={() => handleSolutionClick(solution)}
          >
            <div className="solution_main">
              <h3 className="solution_title">{solution.title}</h3>
              <div className="solution_meta">
                <span className="solution_author">@{solution.user.name}</span>
                <span>{solution.views} views</span>
              </div>
            </div>

            <div className="solution_stats">
              <button
                className="stat_button"
                onClick={e => e.stopPropagation()}
              >
                <ThumbsUp size={14} />
                <span>{solution.likes}</span>
              </button>
              <button
                className="stat_button"
                onClick={e => e.stopPropagation()}
              >
                <ThumbsDown size={14} />
                <span>{solution.dislikes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Solutions;
