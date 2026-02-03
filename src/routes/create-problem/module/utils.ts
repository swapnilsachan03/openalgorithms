export interface Example {
  id: string;
  input: string;
  output: string;
  explanation: string;
}

export const difficultyOptions = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

export const initialState = {
  title: "",
  slug: "",
  description: "",
  difficulty: "",
  timeLimitInSeconds: 1,
  memoryLimitInMB: 256,
  hints: "",
  editorial: "",
  editorialTitle: "",
  examples: [] as Example[],
  topics: [] as string[],
};
