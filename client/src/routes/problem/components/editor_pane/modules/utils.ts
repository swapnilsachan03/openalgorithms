import { SubmissionStatus } from "@/generated/graphql";
import _ from "lodash";

export const languageOptions = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

export const pendingStatusStates = [
  SubmissionStatus.Judging,
  SubmissionStatus.Pending,
];

export const getSubmissionStatusClassName = (status: string) => {
  switch (status) {
    case SubmissionStatus.Accepted:
      return "status_green";

    case SubmissionStatus.CompilationError:
    case SubmissionStatus.InternalError:
    case SubmissionStatus.RuntimeError:
    case SubmissionStatus.WrongAnswer:
    case SubmissionStatus.MemoryLimitExceeded:
    case SubmissionStatus.TimeLimitExceeded:
      return "status_red";

    case SubmissionStatus.Judging:
    case SubmissionStatus.Pending:
      return "status_yellow";
  }
};

export const getStatusText = (status: string): string => {
  return _.capitalize(_.join(_.split(status, "_"), " "));
};
