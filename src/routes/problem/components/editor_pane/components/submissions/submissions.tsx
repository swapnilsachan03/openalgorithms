import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Copy, Timer, ChartBar, Code } from "lucide-react";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import "./submissions.scss";
import { Button } from "generic-ds";
import Chip from "@/components/ui/chip";
import _ from "lodash";

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
    const submissionContent = `\`\`\`${selectedSubmission.language}\n${selectedSubmission.code}\n\`\`\``;

    return (
      <div className="submission_detail">
        <div className="submission_detail_header">
          <Button
            color="neutral"
            size="small"
            variant="outline"
            style={{ padding: "6px" }}
            onClick={handleBack}
          >
            <ArrowLeft size={14} />
          </Button>

          <div className="submission_detail_meta">
            <span
              className={`status status_${selectedSubmission.status
                .toLowerCase()
                .replace(" ", "_")}`}
            >
              {selectedSubmission.status}
            </span>

            <div className="submission_detail_stats">
              <Chip icon={<Timer size={13} />}>
                {selectedSubmission.runtime}
              </Chip>

              <Chip icon={<ChartBar size={13} />}>
                {selectedSubmission.memory}
              </Chip>

              <Chip icon={<Clock size={13} />}>
                {dayjs(selectedSubmission.timestamp).format(
                  "MMM DD, YYYY HH:mm"
                )}
              </Chip>
            </div>
          </div>
        </div>

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
          {submissionContent}
        </ReactMarkdown>

        <div className="copy_to_editor">
          <Button color="cyan" onClick={handleRemix} icon={<Copy size={14} />}>
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
                <Chip icon={<Code size={13} />}>
                  {_.capitalize(submission.language)}
                </Chip>

                <Chip icon={<Timer size={13} />}>{submission.runtime}</Chip>
                <Chip icon={<ChartBar size={13} />}>{submission.memory}</Chip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submissions;
