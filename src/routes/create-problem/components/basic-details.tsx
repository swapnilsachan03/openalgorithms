/**-- external --*/

import _ from "lodash";
import { Button, Input, Select } from "antd";
import {
  AlignLeft,
  Hash,
  ListChecks,
  Timer,
  Database,
  Tag,
  Lightbulb,
  X,
  Plus,
  Globe,
} from "lucide-react";

/**-- internal --*/

import MarkdownEditor from "@/components/ui/markdown-editor";
import { Toast } from "@/lib/toast";
import { Topic } from "@/generated/graphql";

/**-- relative --*/

import "./basic-details.scss";
import { difficultyOptions, Example, ProblemState } from "../module/utils";

interface BasicDetailsProps {
  problemDetails: ProblemState;
  topicsData: Topic[];
  updateField: (field: keyof ProblemState, value: unknown) => void;
  topicsLoading: boolean;
}

const BasicDetails = (props: BasicDetailsProps) => {
  const { problemDetails, topicsData, updateField, topicsLoading } = props;

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
  } = problemDetails;

  const topicsOptions = topicsData.map(topic => ({
    label: topic.name,
    value: topic.id,
  }));

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

  return (
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
            loading={topicsLoading}
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
  );
};

export default BasicDetails;
