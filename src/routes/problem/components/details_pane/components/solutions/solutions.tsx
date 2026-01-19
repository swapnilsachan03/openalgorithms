import _ from "lodash";
import { useState } from "react";
import { Avatar, Button, Input, Tag } from "antd";
import {
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Clock,
  ArrowBigUp,
  ArrowBigDown,
  Eye,
  UserCheck,
  Search,
} from "lucide-react";
import dayjs from "dayjs";

import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { Problem, UserSolution } from "@/generated/graphql";
import { avatarStyles, tagStyle } from "@/lib/styles";

import "./solutions.scss";

type Props = {
  problem: Problem;
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

const Solutions = ({ problem, loading }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSolution, setSelectedSolution] = useState<UserSolution | null>(
    null
  );
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const handleSolutionClick = (solution: UserSolution) => {
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

  const filteredSolutions = !_.isEmpty(problem?.userSolutions)
    ? problem?.userSolutions
    : dummySolutions.filter(solution =>
        solution.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  if (selectedSolution) {
    return (
      <div className="solution_detail">
        <div className="solution_detail_header">
          <Button
            size="small"
            variant="outlined"
            icon={<ArrowLeft size={14} />}
            aria-label="Back"
            onClick={handleBack}
          />

          <div className="solution_title_container">
            <h2>{selectedSolution?.title}</h2>

            <div className="solution_meta">
              <Tag icon={<Eye size={13} />} style={tagStyle}>
                {selectedSolution?.views}
              </Tag>

              <a
                href={`/u/${selectedSolution?.user?.id}`}
                className="solution_author"
              >
                <Tag icon={<UserCheck size={13} />} style={tagStyle}>
                  {selectedSolution?.user?.name}
                </Tag>
              </a>

              <Tag icon={<Clock size={13} />} style={tagStyle}>
                {dayjs(selectedSolution.createdAt).format("MMM DD, YYYY")}
              </Tag>
            </div>
          </div>
        </div>

        <div className="solution_content">
          <MarkdownRenderer content={selectedSolution.content ?? ""} />
        </div>

        <div className="solution_footer">
          <div className="like_dislike_container">
            <button
              className={`stat_button ${userLiked ? "button_liked" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp size={14} />
              <span>{selectedSolution?.likes || 0 + (userLiked ? 1 : 0)}</span>
            </button>

            <button
              className={`stat_button ${userDisliked ? "button_disliked" : ""}`}
              onClick={handleDislike}
            >
              <ThumbsDown size={14} />
              <span>
                {selectedSolution?.dislikes || 0 + (userDisliked ? 1 : 0)}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getAvatarInitials = (name: string) => {
    const names = name.split(" ");

    if (names.length === 1) {
      return names[0][0].toUpperCase() + names[0][1]?.toUpperCase() || "";
    } else {
      return (
        names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
      );
    }
  };

  return (
    <div className="solutions">
      <div className="solutions_header">
        <div className="search_container">
          <Input
            type="text"
            placeholder="Search for a solution"
            prefix={<Search size={16} />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <Button variant="solid" color="geekblue">
          Share your solution
        </Button>
      </div>

      <div className="solutions_list">
        {filteredSolutions?.map(solution => (
          <div key={solution?.id} className="solution_card">
            <a href={`/u/${solution?.user?.id}`} className="solution_author">
              {solution?.user?.name}
            </a>

            <h3
              className="solution_title"
              onClick={() => handleSolutionClick(solution as UserSolution)}
            >
              {solution?.title}
            </h3>

            <div className="solution_meta">
              <Tag icon={<Eye size={13} />} style={tagStyle}>
                {solution?.views}
              </Tag>

              <Tag icon={<ArrowBigUp size={15} />} style={tagStyle}>
                {solution?.likes}
              </Tag>

              <Tag icon={<ArrowBigDown size={15} />} style={tagStyle}>
                {solution?.dislikes}
              </Tag>
            </div>

            <div className="avatar_container">
              <Avatar
                size="default"
                style={avatarStyles[_.random(avatarStyles.length - 1)]}
              >
                {getAvatarInitials(solution?.user?.name ?? "deleted_user")}
              </Avatar>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Solutions;
