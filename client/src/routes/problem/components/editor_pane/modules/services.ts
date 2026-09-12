import _ from "lodash";
import { Toast } from "@/lib/toast";
import { Submission } from "@/generated/graphql";

type MutationFunction = (options: {
  variables: { input: unknown };
}) => Promise<unknown>;

export const handleCreateSubmission = async (
  code: string,
  language: string,
  problemId: string,
  createSubmission: MutationFunction,
  goToSubmissions: () => void
) => {
  try {
    const result = await createSubmission({
      variables: {
        input: {
          code,
          language: _.toUpper(language),
          problemId,
        },
      },
    });

    const submission = (result as { data?: { createSubmission: Submission } })
      .data?.createSubmission;

    if (submission?.id) {
      goToSubmissions();
    }
  } catch (e) {
    Toast.error("Failed to submit solution!");
    console.error(e);
  }
};
