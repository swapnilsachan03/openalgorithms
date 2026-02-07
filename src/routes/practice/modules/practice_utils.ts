import { Problem } from "@/generated/graphql";

export const EMPTY_PROBLEMS: Problem[] = [];

export const difficultyOptions = [
  { value: "ALL", label: "All" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

export interface ProblemRow {
  key: string;
  name: {
    title: string;
    slug: string;
  };
  difficulty: string;
  acceptance: number;
  topics: string[];
  views: number;
  rating: number;
}

export const getPracticeTableRows = (problems: Problem[]) => {
  const data = problems.map(problem => {
    const title = problem.title ?? "";
    const accepted = problem.acceptedSubmissions ?? 0;
    const total = problem.totalSubmissions || 1;
    const views = problem.views ?? 0;
    const likes = problem.likes ?? 0;
    const dislikes = problem.dislikes || 1;
    const topics = (problem.topics ?? []).map(t => t?.name ?? "");
    const difficulty = problem.difficulty ?? "MEDIUM";
    const slug = problem.slug ?? "create";

    return {
      key: problem.id,
      name: {
        title,
        slug,
      },
      views,
      topics,
      difficulty,
      acceptance: (100 * accepted) / total,
      rating: (10 * likes) / dislikes,
    };
  });

  return data;
};
