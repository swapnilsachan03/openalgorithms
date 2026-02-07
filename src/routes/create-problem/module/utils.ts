import _ from "lodash";

import { Problem } from "@/generated/graphql";
import { Toast } from "@/lib/toast";

export interface Example {
  id: string;
  input: string;
  output: string;
  explanation: string;
}

export interface Testcase {
  id: string;
  input: string;
  output: string;
}

export interface ProblemState {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  timeLimitInSeconds: number;
  memoryLimitInMB: number;
  hints: string;
  editorial: string;
  editorialTitle: string;
  examples: Example[];
  topics: string[];
  testcases: Testcase[];
}

export const difficultyOptions = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

export const initialState: ProblemState = {
  title: "",
  slug: "",
  description: "",
  difficulty: "",
  timeLimitInSeconds: 1,
  memoryLimitInMB: 256,
  hints: "",
  editorial: "",
  editorialTitle: "",
  examples: [{ id: "1", input: "", output: "", explanation: "" }],
  topics: [],
  testcases: [{ id: _.uniqueId("testcase-"), input: "", output: "" }],
};

export const handleSubmit = async ({
  problemDetails,
  navigate,
  createProblem,
}: {
  problemDetails: ProblemState;
  navigate: (path: string) => void;
  createProblem: (options: {
    variables: { input: unknown };
  }) => Promise<unknown>;
}) => {
  const {
    title,
    slug,
    description,
    difficulty,
    timeLimitInSeconds,
    memoryLimitInMB,
    hints,
    editorial,
    editorialTitle,
    topics,
    examples,
    testcases,
  } = problemDetails;

  try {
    const input = {
      title,
      slug,
      description,
      difficulty,
      timeLimitInSeconds,
      memoryLimitInMB,
      examples: examples.map(({ input, output, explanation }) => ({
        input,
        output,
        explanation,
      })),
      hints: hints.split("\n"),
      topics,
      testcases: testcases.map(({ input, output }) => ({ input, output })),
      ...(editorialTitle && editorial
        ? {
            editorial: {
              title: editorialTitle,
              content: editorial,
            },
          }
        : {}),
    };

    const result = await createProblem({ variables: { input } });

    const problem = (result as { data?: { createProblem: Problem } }).data
      ?.createProblem;

    if (problem) {
      Toast.success("Problem created successfully");
      navigate(`/problem/${problem.slug}`);
    }
  } catch (error) {
    Toast.error("Failed to create problem");
    console.error(error);
  }
};
