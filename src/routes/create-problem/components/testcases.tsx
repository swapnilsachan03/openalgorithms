import _ from "lodash";
import React, { useState } from "react";
import { Input, Tabs } from "antd";

import "./testcases.scss";
import { ProblemState } from "../module/utils";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface TestcasesProps {
  problemDetails: ProblemState;
  updateField: (field: keyof ProblemState, value: unknown) => void;
}

const Testcases = (props: TestcasesProps) => {
  const { problemDetails, updateField } = props;
  const { testcases } = problemDetails;

  const [activeTestcase, setActiveTestcase] = useState<string>(
    testcases[0]?.id
  );

  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "add") {
      const newTestcase = {
        id: _.uniqueId("testcase-"),
        input: "",
        output: "",
      };

      updateField("testcases", [...testcases, newTestcase]);
      setActiveTestcase(newTestcase.id);
    } else {
      const idx = testcases.findIndex(tc => tc.id === targetKey);
      const updatedTestcases = testcases.filter(tc => tc.id !== targetKey);

      if (updatedTestcases.length === 0) return;

      updateField("testcases", updatedTestcases);
      setActiveTestcase(
        idx === 0 ? updatedTestcases[0].id : updatedTestcases[idx - 1].id
      );
    }
  };

  const testcaseItems = testcases.map((testcase, index) => ({
    label: `Testcase ${index + 1}`,
    key: testcase.id,
    children: (
      <div className="testcase-form">
        <div className="form-field">
          <span className="form-label">Input</span>
          <Input.TextArea
            value={testcase.input}
            onChange={e => {
              const newTestcases = [...testcases];
              newTestcases[index].input = e.target.value;
              updateField("testcases", newTestcases);
            }}
            placeholder="Testcase input"
            autoSize={{ minRows: 10, maxRows: 15 }}
            required
          />
        </div>

        <div className="form-field">
          <span className="form-label">Output</span>
          <Input.TextArea
            value={testcase.output}
            onChange={e => {
              const newTestcases = [...testcases];
              newTestcases[index].output = e.target.value;
              updateField("testcases", newTestcases);
            }}
            placeholder="Testcase output"
            autoSize={{ minRows: 10, maxRows: 15 }}
            required
          />
        </div>
      </div>
    ),
  }));

  return (
    <div className="testcase-editor">
      <h2>Testcases</h2>

      <Tabs
        type="editable-card"
        size="small"
        activeKey={activeTestcase}
        onChange={setActiveTestcase}
        onEdit={onEdit}
        items={testcaseItems}
      />
    </div>
  );
};

export default Testcases;
