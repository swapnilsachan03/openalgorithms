import _ from "lodash";

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
