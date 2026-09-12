/**-- external --*/

import _ from "lodash";
import { useState } from "react";
import { ArrowLeft, Clock, Copy, Timer, ChartBar, Code } from "lucide-react";
import { Button, Tag } from "antd";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";

/**-- internal --*/

import { tagStyle } from "@/lib/styles";
import { useIsLoggedIn, useUserId } from "@/stores/userStore";
import { Submission } from "@/generated/graphql";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

/**-- relative --*/

import { getUserSubmissionsQuery } from "../../modules/queries";
import {
  getStatusText,
  getSubmissionStatusClassName,
} from "../../modules/utils";

import "./submissions.scss";

type Props = {
  loading: boolean;
  problemId: string;
  onCopyToEditor: (code: string, language: string) => void;
};

const Submissions = ({ loading, problemId, onCopyToEditor }: Props) => {
  const isLoggedIn = useIsLoggedIn();
  const userId = useUserId();

  const { loading: isLoadingSubmissions, data } = useQuery(
    getUserSubmissionsQuery,
    {
      variables: {
        filters: {
          userId,
          problemId,
        },
      },
      skip: !isLoggedIn || !userId || !problemId,
    }
  );

  const submissions = _.get(data, "submissions", []) as Submission[];

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleBack = () => {
    setSelectedSubmission(null);
  };

  const handleCopyToEditor = () => {
    if (selectedSubmission?.code && selectedSubmission?.language) {
      onCopyToEditor(selectedSubmission.code, selectedSubmission.language);
      setSelectedSubmission(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="submissions">
        <span className="submissions_center_content">
          Log in to view your submissions
        </span>
      </div>
    );
  }

  if (loading || isLoadingSubmissions) {
    return (
      <div className="submissions">
        <span className="submissions_center_content">Loading...</span>
      </div>
    );
  }

  if (selectedSubmission) {
    const submissionContent = `\`\`\`${_.toLower(selectedSubmission.language!)}\n${selectedSubmission.code}\n\`\`\``;

    const statusColor = getSubmissionStatusClassName(
      selectedSubmission.status!
    );

    const statusText = getStatusText(selectedSubmission.status!);

    return (
      <div className="submission_detail">
        <div className="submission_detail_header">
          <Button
            variant="outlined"
            onClick={handleBack}
            icon={<ArrowLeft size={14} />}
          />

          <div className="submission_detail_meta">
            <span className={`status ${statusColor}`}>{statusText}</span>

            <div className="submission_detail_stats">
              <Tag style={tagStyle} icon={<Timer size={13} />}>
                {selectedSubmission.maxRuntimeMs}
              </Tag>

              <Tag style={tagStyle} icon={<ChartBar size={13} />}>
                {selectedSubmission.maxMemoryMb}
              </Tag>

              <Tag style={tagStyle} icon={<Clock size={13} />}>
                {dayjs(selectedSubmission.createdAt!).format(
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

  if (submissions?.length == 0) {
    return (
      <div className="submissions">
        <span className="submissions_center_content">No submissions yet.</span>
      </div>
    );
  }

  return (
    <div className="submissions">
      <div className="submissions_list">
        {submissions.map(submission => {
          if (!submission) return null;

          const statusColor = getSubmissionStatusClassName(submission.status!);
          const statusText = getStatusText(submission.status!);

          return (
            <div
              key={submission.id}
              className="submission_card"
              onClick={() => handleSubmissionClick(submission)}
            >
              <div className="submission_card_main">
                <div className="submission_card_info">
                  <span className={`status_small ${statusColor}`}>
                    {statusText}
                  </span>

                  <span>
                    {dayjs(submission.createdAt).format("MMM DD, YYYY HH:mm")}
                  </span>
                </div>

                <div className="submission_card_meta">
                  <Tag style={tagStyle} icon={<Code size={13} />}>
                    {_.capitalize(_.toLower(submission.language!))}
                  </Tag>

                  <Tag style={tagStyle} icon={<Timer size={13} />}>
                    {submission.maxRuntimeMs}
                  </Tag>

                  <Tag style={tagStyle} icon={<ChartBar size={13} />}>
                    {submission.maxMemoryMb}
                  </Tag>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Submissions;
