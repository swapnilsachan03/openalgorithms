/**-- external --*/

import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button, Input, Select, Tabs } from "antd";
import {
  AlignLeft,
  Hash,
  ListChecks,
  Timer,
  Database,
  Tag,
  Lightbulb,
  PlusCircle,
  X,
  Plus,
  Globe,
} from "lucide-react";

/**-- internal --*/

import { useIsAdmin } from "@/stores/userStore";
import { Toast } from "@/lib/toast";
import { Problem, Topic } from "@/generated/graphql";
import MarkdownEditor from "@/components/ui/markdown-editor";

/**-- relative --*/

import "./create-problem.scss";
import { createProblemMutation } from "./module/mutations";
import { difficultyOptions, Example, initialState } from "./module/utils";
import { getTopicsQuery } from "./module/queries";

const CreateProblem = () => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const [createProblem, { loading }] = useMutation(createProblemMutation);
  const { loading: areTopicsLoading, data } = useQuery(getTopicsQuery);

  const topicsData = _.get(data, "topics", []) as Topic[];

  const topicsOptions = topicsData.map(topic => ({
    label: topic.name,
    value: topic.id,
  }));

  const [problemDetails, setProblemDetails] = useState(initialState);

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

  const [activeTestcase, setActiveTestcase] = useState<string>(
    testcases.length > 0 ? testcases[0].id : ""
  );

  useEffect(() => {
    if (!isAdmin) {
      Toast.error("You don't have permission to access this page");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const updateField = (field: keyof typeof initialState, value: unknown) => {
    setProblemDetails({
      ...problemDetails,
      [field]: value,
    });
  };

  const addExample = () => {
    updateField("examples", [
      ...examples,
      {
        id: _.uniqueId("example-"),
        input: "",
        output: "",
        explanation: "",
      },
    ]);
  };

  const removeExample = (id: string) => {
    if (examples.length === 1) {
      Toast.warning("At least one example is required");
      return;
    }

    updateField(
      "examples",
      examples.filter(ex => ex.id !== id)
    );
  };

  const updateExample = (id: string, field: keyof Example, value: string) => {
    updateField(
      "examples",
      examples.map(ex => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSubmit = async () => {
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
        hints: _.split(hints, "\n"),
        topics,
        testcases: [],
        ...(!_.isEmpty(editorialTitle) && !_.isEmpty(editorial)
          ? {
              editorial: {
                title: editorialTitle,
                content: editorial,
              },
            }
          : {}),
      };

      const result = await createProblem({ variables: { input } });

      const problem = (result.data as { createProblem: Problem })
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

  type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

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
    <div className="create-problem">
      <h1>Create problem</h1>

      <div onSubmit={handleSubmit}>
        <div className="problem-form">
          <div className="basic-details">
            <div className="form-section">
              <h2>Basic information</h2>

              <div className="form-field">
                <span className="form-label">Problem Title</span>
                <Input
                  name="title"
                  value={title}
                  onChange={e => updateField("title", e.target.value)}
                  placeholder="Search for a problem"
                  prefix={<AlignLeft size={14} />}
                  required
                />
              </div>

              <div className="form-field">
                <span className="form-label">Slug (for routing)</span>
                <Input
                  name="slug"
                  value={slug}
                  onChange={e => updateField("slug", e.target.value)}
                  placeholder="Enter problem slug"
                  prefix={<Globe size={14} />}
                  required
                />
              </div>

              <div className="form-field">
                <span className="form-label">Problem Description</span>
                <MarkdownEditor
                  value={description}
                  onChange={value => updateField("description", value)}
                  height={400}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <span className="form-label">Difficulty</span>
                  <Select
                    placeholder="Select difficulty"
                    value={difficulty}
                    onChange={value => updateField("difficulty", value)}
                    options={difficultyOptions}
                    className="select-difficulty"
                  />
                </div>

                <div className="form-field">
                  <span className="form-label">Time Limit (seconds)</span>
                  <Input
                    name="timeLimit"
                    value={timeLimitInSeconds}
                    onChange={e =>
                      updateField("timeLimitInSeconds", e.target.valueAsNumber)
                    }
                    type="number"
                    min="1"
                    prefix={<Timer size={14} />}
                    required
                  />
                </div>

                <div className="form-field">
                  <span className="form-label">Memory Limit (MB)</span>
                  <Input
                    name="memoryLimit"
                    value={memoryLimitInMB}
                    onChange={e =>
                      updateField("memoryLimitInMB", e.target.valueAsNumber)
                    }
                    type="number"
                    min="1"
                    prefix={<Database size={14} />}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h2>Example test cases</h2>

                <Button onClick={addExample} color="geekblue" variant="solid">
                  <Plus size={14} />
                  Add Example
                </Button>
              </div>

              {examples.map((example, index) => (
                <div key={example.id} className="input-group">
                  <div className="group-subheader">
                    Example {index + 1}
                    <Button
                      aria-label="Remove example"
                      onClick={() => removeExample(example.id)}
                      icon={<X size={14} />}
                    />
                  </div>

                  <div className="form-field">
                    <span className="form-label">Input</span>
                    <Input
                      value={example.input}
                      onChange={e =>
                        updateExample(example.id, "input", e.target.value)
                      }
                      prefix={<Hash size={14} />}
                      placeholder="Example input"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <span className="form-label">Output</span>
                    <Input
                      value={example.output}
                      onChange={e =>
                        updateExample(example.id, "output", e.target.value)
                      }
                      prefix={<ListChecks size={14} />}
                      placeholder="Example output"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <span className="form-label">Explanation</span>
                    <Input.TextArea
                      value={example.explanation}
                      onChange={e =>
                        updateExample(example.id, "explanation", e.target.value)
                      }
                      placeholder="Explain the example"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="form-section">
              <h2>Topics & Hints</h2>

              <div className="form-field">
                <span className="form-label">Topics</span>
                <Select
                  placeholder="Select topics related to the problem"
                  prefix={<Tag size={14} />}
                  value={topics}
                  options={topicsOptions}
                  onChange={value => updateField("topics", value)}
                  loading={areTopicsLoading}
                  mode="multiple"
                  maxTagCount={3}
                />
              </div>

              <div className="form-field">
                <span className="form-label">Hints</span>
                <Input.TextArea
                  name="hints"
                  value={hints}
                  onChange={e => updateField("hints", e.target.value)}
                  placeholder="Enter hints (one per line)"
                  rows={3}
                />
              </div>
            </div>

            <div className="form-section form-section-without-border">
              <h2>Editorial (optional)</h2>

              <div className="form-field">
                <span className="form-label">Editorial title</span>
                <Input
                  name="editorialTitle"
                  value={editorialTitle}
                  onChange={e => updateField("editorialTitle", e.target.value)}
                  placeholder="Enter editorial title"
                  prefix={<Lightbulb size={14} />}
                />
              </div>

              <div className="form-field">
                <span className="form-label">Editorial Content</span>
                <MarkdownEditor
                  value={editorial}
                  onChange={value => updateField("editorial", value)}
                  height={400}
                />
              </div>
            </div>
          </div>

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
        </div>

        <div className="form-actions">
          <Button
            disabled={loading}
            type="primary"
            color="geekblue"
            onClick={handleSubmit}
          >
            <PlusCircle size={14} />
            Create problem
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProblem;
