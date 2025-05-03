import _ from "lodash";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import { Button, Input, Select } from "generic-ds";
import { useQuery } from "@apollo/client";

import { Problem } from "@/generated/graphql";
import Table, { Column } from "@/components/ui/table";
import { useIsAdmin } from "@/stores/userStore";

import { getProblemsQuery } from "./modules/practice_queries";

import "./practice.scss";

const difficultyOptions = [
  { value: "ALL", label: "All" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const Practice = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);

  const isAdmin = useIsAdmin();

  const { loading, data } = useQuery(getProblemsQuery, {
    variables: {
      filters: { search: searchQuery, difficulty, take: 10, skip: 0 },
    },
    fetchPolicy: "cache-first",
  });

  type ProblemRow = {
    title: React.ReactNode;
    views: number;
    topics: string[];
    difficulty: string;
    acceptance: number;
    rating: number;
  };

  const columns: Column<ProblemRow>[] = [
    { key: "title", label: "Title", align: "left" },
    {
      key: "difficulty",
      label: "Difficulty",
      align: "center",
      render: difficulty => {
        let color = "red";

        switch (difficulty) {
          case "EASY":
            color = "green";
            break;
          case "MEDIUM":
            color = "rgb(234 179 8)";
            break;
          case "HARD":
            color = "red";
            break;
        }

        return (
          <span style={{ color }}>{_.capitalize(difficulty as string)}</span>
        );
      },
    },
    { key: "acceptance", label: "Acceptance", align: "left" },
    {
      key: "topics",
      label: "Topics",
      align: "left",
      render: topics =>
        _.size(topics as string[]) ? (
          _.size(topics as string[])
        ) : (
          <em className="text-secondary">No topics mapped</em>
        ),
    },
    { key: "views", label: "Views", align: "center" },
    { key: "rating", label: "Rating", align: "center" },
  ];

  const problems: Problem[] = data?.problems?.edges;

  const rows: ProblemRow[] = problems?.map(problem => {
    const title = problem.title ?? "";
    const accepted = problem.acceptedSubmissions ?? 0;
    const total = problem.totalSubmissions || 1;
    const views = problem.views ?? 0;
    const likes = problem.likes ?? 0;
    const dislikes = problem.dislikes || 1;
    const topics = (problem.topics ?? []).map(t => t ?? "");
    const difficulty = problem.difficulty ?? "MEDIUM";
    const slug = problem.slug ?? "create";

    return {
      title: (
        <Link to={`../problem/${slug}`} className="problem_title_link">
          {title}
        </Link>
      ),
      views,
      topics,
      difficulty,
      acceptance: (100 * accepted) / total,
      rating: (10 * likes) / dislikes,
    };
  });

  return (
    <div className="practice">
      <div className="practice_header">
        <div className="problem_filters">
          <Input
            placeholder="Search for a problem"
            color="sky"
            variant="outline"
            icon={<Search size={16} />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <Select
            value={difficulty}
            onChange={setDifficulty}
            variant="outline"
            color="zinc"
            options={difficultyOptions}
            placeholder="Difficulty"
          />
        </div>

        {isAdmin && (
          <Link to="../create-problem">
            <Button color="cyan" icon={<PlusCircle size={16} />}>
              Create problem
            </Button>
          </Link>
        )}
      </div>

      <div className="practice_content">
        <Table
          headers={columns}
          data={rows}
          showHeaders
          loading={loading}
          striped
          hover
          emptyText="No problems found."
        />
      </div>
    </div>
  );
};

export default Practice;
