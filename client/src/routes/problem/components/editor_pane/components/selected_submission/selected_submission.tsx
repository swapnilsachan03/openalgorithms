/**-- external --*/

import { Button, Tag } from "antd";
import _ from "lodash";
import dayjs from "dayjs";
import { ArrowLeft, ChartBar, Clock, Copy, Timer } from "lucide-react";

/**-- internal --*/

import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { tagStyle } from "@/lib/styles";
import { Submission } from "@/generated/graphql";

/**-- relative --*/

import {
  getStatusText,
  getSubmissionStatusClassName,
  pendingStatusStates,
} from "../../modules/utils";

import "./selected_submission.scss";
import classNames from "classnames";

type Props = {
  selectedSubmission: Submission;
  handleBack: () => void;
  handleCopyToEditor: () => void;
};

const SelectedSubmission = (props: Props) => {
  const { selectedSubmission, handleBack, handleCopyToEditor } = props;

  const submissionContent = `\`\`\`${_.toLower(selectedSubmission.language!)}\n${selectedSubmission.code}\n\`\`\``;

  const statusText = getStatusText(selectedSubmission.status!);
  const statusColor = getSubmissionStatusClassName(selectedSubmission.status!);

  const statusTextClasses = classNames("status", statusColor, {
    submission_detail_polling: _.includes(
      pendingStatusStates,
      selectedSubmission.status
    ),
  });

  return (
    <div className="submission_detail">
      <div className="submission_detail_header">
        <Button
          variant="outlined"
          onClick={handleBack}
          icon={<ArrowLeft size={14} />}
        />

        <div className="submission_detail_meta">
          <span className={statusTextClasses}>{statusText}</span>

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
};

export default SelectedSubmission;
