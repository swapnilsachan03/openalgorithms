/**-- external --*/

import _ from "lodash";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Search } from "lucide-react";
import { Button, Input, Select, Table, TableProps } from "antd";
import { useQuery } from "@apollo/client/react";

/**-- internal --*/

import { Problem } from "@/generated/graphql";
import { useIsAdmin } from "@/stores/userStore";

/**-- relative --*/

import "./practice.scss";
import { getProblemsQuery } from "./modules/practice_queries";
import {
  EMPTY_PROBLEMS,
  difficultyOptions,
  ProblemRow,
  getPracticeTableRows,
} from "./modules/practice_utils";

const getPracticeTableHeaders = ({
  isAdmin,
}: {
  isAdmin: boolean;
}): TableProps<ProblemRow>["columns"] => {
  const headers = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      render: (name: { title: string; slug: string }) => (
        <Link to={`../problem/${name.slug}`} className="problem_title_link">
          {name.title}
        </Link>
      ),
    },
    {
      title: "Difficulty",
      key: "difficulty",
      dataIndex: "difficulty",
      render: (difficulty: string) => {
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

        return <span style={{ color }}>{_.capitalize(difficulty)}</span>;
      },
      width: 150,
    },
    {
      title: "Acceptance",
      key: "acceptance",
      dataIndex: "acceptance",
      width: 150,
    },
    {
      title: "Topics",
      key: "topics",
      dataIndex: "topics",
      width: 150,
      render: (topics: string[]) =>
        _.size(topics) ?? (
          <span className="text-secondary">No topics mapped</span>
        ),
    },
    { title: "Views", key: "views", dataIndex: "views", width: 120 },
    { title: "Rating", key: "rating", dataIndex: "rating", width: 120 },
    {
      title: "Edit",
      key: "edit",
      dataIndex: "name",
      width: 50,
      render: (name: { slug: string }) => (
        <Link to={`../edit-problem/${name.slug}`}>
          <Button color="primary" variant="link" icon={<Pencil size={14} />} />
        </Link>
      ),
      isVisible: isAdmin,
    },
  ];

  return _.filter(headers, header => header.isVisible !== false);
};

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

  const problems: Problem[] = _.get(data, "problems.edges", EMPTY_PROBLEMS);

  const columns = getPracticeTableHeaders({ isAdmin });
  const rows: ProblemRow[] = getPracticeTableRows(problems);

  return (
    <div className="practice">
      <div className="practice_header">
        <div className="problem_filters">
          <Input
            placeholder="Search for a problem"
            prefix={<Search size={16} />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            allowClear
          />

          <Select
            placeholder="Difficulty"
            value={difficulty}
            options={difficultyOptions}
            onChange={setDifficulty}
            className="select-difficulty"
          />
        </div>

        {isAdmin && (
          <Link to="../create-problem">
            <Button color="geekblue" variant="solid" icon={<Plus size={16} />}>
              Create problem
            </Button>
          </Link>
        )}
      </div>

      <div className="practice_content">
        <Table
          columns={columns}
          dataSource={rows}
          loading={loading}
          size="small"
          sticky
        />
      </div>
    </div>
  );
};

export default Practice;
