import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "generic-ds";
import { useQuery } from "@apollo/client";

import { Problem } from "@/generated/graphql";
import Table, { Column } from "@/components/ui/table";
import { useIsAdmin } from "@/stores/userStore";

import "./practice.scss";
import { getProblemsQuery } from "./modules/practice_queries";
import _ from "lodash";

const Practice = () => {
  const isAdmin = useIsAdmin();

  type ProblemRow = {
    title: React.ReactNode;
    views: number;
    topics: string[];
    difficulty: string;
    acceptance: number;
    popularity: number;
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
          <span className="text-secondary">No topics mapped</span>
        ),
    },
    { key: "views", label: "Views", align: "center" },
    { key: "popularity", label: "Popularity", align: "center" },
  ];

  const { loading, data } = useQuery(getProblemsQuery);

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
      popularity: (100 * likes) / dislikes,
    };
  });

  return (
    <div className="practice">
      <div className="practice_header">
        <h1>Practice Problems</h1>
        {isAdmin && (
          <Link to="../create-problem">
            <Button color="cyan" icon={<PlusCircle size={16} />}>
              Create Problem
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
          emptyText="No users found."
        />
      </div>
    </div>
  );
};

export default Practice;
