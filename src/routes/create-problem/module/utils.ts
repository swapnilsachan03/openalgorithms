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
