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
  isNew: boolean;
  isUpdated: boolean;
}

export interface ProblemState {
  id?: string;
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
  testcases: [
    {
      id: _.uniqueId("testcase-"),
      input: "",
      output: "",
      isNew: true,
      isUpdated: false,
    },
  ],
};

export const initializeProblemDetailsState = (
  problem: Problem
): ProblemState => {
  const id = _.get(problem, "id", undefined);
  const title = _.get(problem, "title", "") as string;
  const slug = _.get(problem, "slug", "") as string;
  const description = _.get(problem, "description", "") as string;
  const difficulty = _.get(problem, "difficulty", "") as string;
  const timeLimitInSeconds = _.get(problem, "timeLimitInSeconds", 1) as number;
  const memoryLimitInMB = _.get(problem, "memoryLimitInMB", 256) as number;
  const hints = _.get(problem, "hints", []) as Array<{ content: string }>;
  const editorial = _.get(problem, "editorial.content", "") as string;
  const editorialTitle = _.get(problem, "editorial.title", "") as string;
  const examples = _.get(problem, "examples", []) as Array<{
    id: string;
    input: string;
    output: string;
    explanation: string;
  }>;
  const topics = _.get(problem, "topics", []) as Array<{ id: string }>;
  const testcases = _.get(problem, "testcases", []) as Array<{
    id: string;
    input: string;
    output: string;
  }>;

  return {
    id,
    title,
    slug,
    description,
    difficulty,
    timeLimitInSeconds,
    memoryLimitInMB,
    hints: hints.map(hint => hint.content).join("\n"),
    editorial,
    editorialTitle,
    examples: examples.map(example => ({
      id: example.id,
      input: example.input,
      output: example.output,
      explanation: example.explanation,
    })),
    topics: topics.map(topic => topic.id),
    testcases: testcases.map(testcase => ({
      id: testcase.id,
      input: testcase.input,
      output: testcase.output,
      isNew: false,
      isUpdated: false,
    })),
  };
};

type MutationFunction = (options: {
  variables: { input: unknown };
}) => Promise<unknown>;

export const handleSubmit = async (
  problemDetails: ProblemState,
  intialProblemDetails: ProblemState,
  navigate: (params: string) => void,
  createProblem: MutationFunction,
  updateProblem: MutationFunction
) => {
  const {
    id,
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
      id,
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
      ...(editorialTitle && editorial
        ? {
            editorial: {
              title: editorialTitle,
              content: editorial,
            },
          }
        : {}),
    };

    if (id) {
      const initialTestcases = intialProblemDetails.testcases;
      const currentTestcases = problemDetails.testcases;

      const addedTestcases = _.filter(currentTestcases, tc =>
        _.get(tc, "isNew")
      ).map(tc => ({ input: tc.input, output: tc.output }));

      const updatedTestcases = _.filter(
        currentTestcases,
        tc => _.get(tc, "isUpdated") && !_.get(tc, "isNew")
      ).map(tc => ({ id: tc.id, input: tc.input, output: tc.output }));

      const deletedTestcases = _.difference(
        _.map(initialTestcases, "id"),
        _.map(currentTestcases, "id")
      );

      const testcasesInput = {
        addedTestcases,
        updatedTestcases,
        deletedTestcases,
      };

      const result = await updateProblem({
        variables: { input: { ...input, testcases: testcasesInput } },
      });

      const problem = (result as { data?: { updateProblem: Problem } }).data
        ?.updateProblem;

      if (problem) {
        Toast.success("Problem updated successfully");
        navigate(`/problem/${problem.slug}`);
      }
    } else {
      const testcasesInput = testcases.map(({ input, output }) => ({
        input,
        output,
      }));

      const result = await createProblem({
        variables: { input: { ...input, testcases: testcasesInput } },
      });

      const problem = (result as { data?: { createProblem: Problem } }).data
        ?.createProblem;

      if (problem) {
        Toast.success("Problem created successfully");
        navigate(`/problem/${problem.slug}`);
      }
    }
  } catch (error) {
    Toast.error("Failed to create problem");
    console.error(error);
  }
};
