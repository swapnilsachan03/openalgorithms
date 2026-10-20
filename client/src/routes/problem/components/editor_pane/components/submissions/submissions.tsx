/**-- external --*/

import _ from "lodash";
import { useEffect, useState } from "react";
import { Timer, ChartBar, Code } from "lucide-react";
import { Tag } from "antd";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import classNames from "classnames";

/**-- internal --*/

import { tagStyle } from "@/lib/styles";
import { useIsLoggedIn, useUserId } from "@/stores/userStore";
import { Submission } from "@/generated/graphql";

/**-- relative --*/

import { getUserSubmissionsQuery } from "../../modules/queries";
import {
  getStatusText,
  getSubmissionStatusClassName,
  pendingStatusStates,
} from "../../modules/utils";
import SelectedSubmission from "../selected_submission/selected_submission";

import "./submissions.scss";

type Props = {
  loading: boolean;
  problemId: string;
  onCopyToEditor: (code: string, language: string) => void;
};

const Submissions = ({ loading, problemId, onCopyToEditor }: Props) => {
  const isLoggedIn = useIsLoggedIn();
  const userId = useUserId();

  const {
    loading: isLoadingSubmissions,
    data,
    startPolling,
    stopPolling,
  } = useQuery(getUserSubmissionsQuery, {
    variables: {
      filters: {
        userId,
        problemId,
      },
    },
    fetchPolicy: "cache-and-network",
    skip: !isLoggedIn || !userId || !problemId,
  });

  const submissions = _.get(data, "submissions", []) as Submission[];

  const isSomeSubmissionPending = _.some(submissions, submission =>
    _.includes(pendingStatusStates, submission.status)
  );

  useEffect(() => {
    if (isSomeSubmissionPending) {
      startPolling(1000);
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [isSomeSubmissionPending, startPolling, stopPolling]);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);

  const selectedSubmission = selectedSubmissionId
    ? _.find(submissions, { id: selectedSubmissionId })
    : null;

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmissionId(submission.id);
  };

  const handleBack = () => {
    setSelectedSubmissionId(null);
  };

  const handleCopyToEditor = () => {
    if (selectedSubmission?.code && selectedSubmission?.language) {
      onCopyToEditor(
        selectedSubmission.code,
        _.toLower(selectedSubmission.language)
      );

      setSelectedSubmissionId(null);
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

  if ((loading || isLoadingSubmissions) && _.isEmpty(submissions)) {
    return (
      <div className="submissions">
        <span className="submissions_center_content">Loading...</span>
      </div>
    );
  }

  if (selectedSubmission) {
    return (
      <SelectedSubmission
        selectedSubmission={selectedSubmission}
        handleBack={handleBack}
        handleCopyToEditor={handleCopyToEditor}
      />
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

          const submissionCardClasses = classNames("submission_card", {
            submission_card_polling: _.includes(
              pendingStatusStates,
              submission.status
            ),
          });

          return (
            <div
              key={submission.id}
              className={submissionCardClasses}
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
