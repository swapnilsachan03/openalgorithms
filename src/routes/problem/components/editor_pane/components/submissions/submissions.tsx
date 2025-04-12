import { useState } from "react";
import { ArrowLeft, Clock, User, Copy } from "lucide-react";
import dayjs from "dayjs";
import Editor from "@monaco-editor/react";

import "./submissions.scss";

type Props = {
  loading: boolean;
  onRemix: (code: string, language: string) => void;
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

const Submissions = ({ loading, onRemix }: Props) => {
  const [selectedSubmission, setSelectedSubmission] = useState<
    (typeof dummySubmissions)[0] | null
  >(null);

  const handleSubmissionClick = (submission: (typeof dummySubmissions)[0]) => {
    setSelectedSubmission(submission);
  };

  const handleBack = () => {
    setSelectedSubmission(null);
  };

  const handleRemix = () => {
    if (selectedSubmission) {
      onRemix(selectedSubmission.code, selectedSubmission.language);
      setSelectedSubmission(null);
    }
  };

  if (loading) {
    return <div className="submissions">Loading...</div>;
  }

  if (selectedSubmission) {
    return (
      <div className="submission_detail">
        <div className="submission_detail_header">
          <button className="back_button" onClick={handleBack}>
            <ArrowLeft size={16} />
          </button>
          <div className="submission_info">
            <div className="submission_meta">
              <span
                className={`status status_${selectedSubmission.status
                  .toLowerCase()
                  .replace(" ", "_")}`}
              >
                {selectedSubmission.status}
              </span>
              <span>{selectedSubmission.runtime}</span>
              <span>{selectedSubmission.memory}</span>
            </div>
            <div className="submission_user">
              <User size={14} />
              <span className="username">@{selectedSubmission.user.name}</span>
              <Clock size={14} />
              <span>
                {dayjs(selectedSubmission.timestamp).format(
                  "MMM DD, YYYY HH:mm"
                )}
              </span>
            </div>
          </div>
          <button className="remix_button" onClick={handleRemix}>
            <Copy size={14} />
            Remix
          </button>
        </div>

        <div className="submission_code">
          <Editor
            height="100%"
            defaultLanguage={selectedSubmission.language}
            value={selectedSubmission.code}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: "on",
            }}
          />
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
                  className={`status status_${submission.status
                    .toLowerCase()
                    .replace(" ", "_")}`}
                >
                  {submission.status}
                </span>
                <span>{submission.runtime}</span>
                <span>{submission.memory}</span>
              </div>
              <div className="submission_card_meta">
                <span className="language">{submission.language}</span>
                <span>
                  {dayjs(submission.timestamp).format("MMM DD, YYYY HH:mm")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submissions;
