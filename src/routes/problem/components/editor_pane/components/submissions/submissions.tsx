import _ from "lodash";
import { useState } from "react";
import { ArrowLeft, Clock, Copy, Timer, ChartBar, Code } from "lucide-react";
import { Button, Tag } from "antd";
import dayjs from "dayjs";

import MarkdownRenderer from "@/components/ui/markdown-renderer";

import "./submissions.scss";
import { tagStyle } from "@/lib/styles";

type Props = {
  loading: boolean;
  onCopyToEditor: (code: string, language: string) => void;
};

// Dummy submissions data
const dummySubmissions = [
  {
    id: "1",
    status: "Accepted",
    runtime: "52 ms",
    memory: "16.4 MB",
    language: "python",
    code: `def twoSum(self, nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    timestamp: "2024-04-09T15:30:00Z",
    user: {
      name: "pythondev",
    },
  },
  {
    id: "2",
    status: "Wrong Answer",
    runtime: "48 ms",
    memory: "16.2 MB",
    language: "javascript",
    code: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
    timestamp: "2024-04-09T14:45:00Z",
    user: {
      name: "jsdev",
    },
  },
];

const Submissions = ({ loading, onCopyToEditor }: Props) => {
  const [selectedSubmission, setSelectedSubmission] = useState<
    (typeof dummySubmissions)[0] | null
  >(null);

  const handleSubmissionClick = (submission: (typeof dummySubmissions)[0]) => {
    setSelectedSubmission(submission);
  };

  const handleBack = () => {
    setSelectedSubmission(null);
  };

  const handleCopyToEditor = () => {
    if (selectedSubmission) {
      onCopyToEditor(selectedSubmission.code, selectedSubmission.language);
      setSelectedSubmission(null);
    }
  };

  if (loading) {
    return <div className="submissions">Loading...</div>;
  }

  if (selectedSubmission) {
    const submissionContent = `\`\`\`${selectedSubmission.language}\n${selectedSubmission.code}\n\`\`\``;

    return (
      <div className="submission_detail">
        <div className="submission_detail_header">
          <Button
            variant="outlined"
            onClick={handleBack}
            icon={<ArrowLeft size={14} />}
          />

          <div className="submission_detail_meta">
            <span
              className={`status status_${selectedSubmission.status
                .toLowerCase()
                .replace(" ", "_")}`}
            >
              {selectedSubmission.status}
            </span>

            <div className="submission_detail_stats">
              <Tag style={tagStyle} icon={<Timer size={13} />}>
                {selectedSubmission.runtime}
              </Tag>

              <Tag style={tagStyle} icon={<ChartBar size={13} />}>
                {selectedSubmission.memory}
              </Tag>

              <Tag style={tagStyle} icon={<Clock size={13} />}>
                {dayjs(selectedSubmission.timestamp).format(
                  "MMM DD, YYYY HH:mm"
                )}
              </Tag>
            </div>
          </div>
        </div>

        <MarkdownRenderer content={submissionContent} />

        <div className="copy_to_editor">
          <Button
            variant="solid"
            color="blue"
            onClick={handleCopyToEditor}
            icon={<Copy size={14} />}
          >
            Copy to editor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="submissions">
      <div className="submissions_list">
        {dummySubmissions.map(submission => (
          <div
            key={submission.id}
            className="submission_card"
            onClick={() => handleSubmissionClick(submission)}
          >
            <div className="submission_card_main">
              <div className="submission_card_info">
                <span
                  className={`status_small status_${submission.status
                    .toLowerCase()
                    .replace(" ", "_")}`}
                >
                  {submission.status}
                </span>

                <span>
                  {dayjs(submission.timestamp).format("MMM DD, YYYY HH:mm")}
                </span>
              </div>

              <div className="submission_card_meta">
                <Tag style={tagStyle} icon={<Code size={13} />}>
                  {_.capitalize(submission.language)}
                </Tag>

                <Tag style={tagStyle} icon={<Timer size={13} />}>
                  {submission.runtime}
                </Tag>

                <Tag style={tagStyle} icon={<ChartBar size={13} />}>
                  {submission.memory}
                </Tag>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submissions;
