import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
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
} from "lucide-react";
import { Input, Button, Select, TextArea, IconButton } from "generic-ds";

import "./create-problem.scss";
import { createProblemMutation } from "@/routes/problem/modules/queries";
import { useIsAdmin } from "@/stores/userStore";
import { Toast } from "@/lib/toast";
import MarkdownEditor from "@/components/ui/markdown-editor";

interface Example {
  id: string;
  input: string;
  output: string;
  explanation: string;
}

const difficultyOptions = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const CreateProblem = () => {
  const navigate = useNavigate();
  const isAdmin = true; // useIsAdmin(); // Uncomment this line when integrating with the actual user store
  const [createProblem, { loading }] = useMutation(createProblemMutation);

  const [description, setDescription] = useState("");
  const [editorial, setEditorial] = useState("");
  const [examples, setExamples] = useState<Example[]>([
    { id: "1", input: "", output: "", explanation: "" },
  ]);

  useEffect(() => {
    if (!isAdmin) {
      Toast.error("You don't have permission to access this page");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const addExample = () => {
    setExamples([
      ...examples,
      {
        id: String(examples.length + 1),
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
    setExamples(examples.filter(ex => ex.id !== id));
  };

  const updateExample = (id: string, field: keyof Example, value: string) => {
    setExamples(
      examples.map(ex => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const input = {
        title: formData.get("title"),
        description,
        difficulty: formData.get("difficulty"),
        timeLimitInSeconds: Number(formData.get("timeLimit")),
        memoryLimitInMB: Number(formData.get("memoryLimit")),
        examples: examples.map(({ input, output, explanation }) => ({
          input,
          output,
          explanation,
        })),
        hints: formData.getAll("hints[]").map(hint => ({ content: hint })),
        topics: formData.getAll("topics[]"),
        editorial: {
          content: editorial,
        },
      };

      const result = await createProblem({ variables: { input } });
      if (result.data?.createProblem) {
        Toast.success("Problem created successfully");
        navigate(`/problem/${result.data.createProblem.slug}`);
      }
    } catch (error) {
      Toast.error("Failed to create problem");
      console.error(error);
    }
  };

  return (
    <div className="create-problem">
      <h1>Create problem</h1>

      <form onSubmit={handleSubmit} className="create-problem-form">
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-field">
            <span className="form-label">Problem Title</span>
            <div className="input-with-icon">
              <Input
                name="title"
                placeholder="Enter problem title"
                variant="outline"
                color="yellow"
                icon={<AlignLeft size={14} />}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <span className="form-label">Problem Description</span>
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              height={400}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <span className="form-label">Difficulty</span>
              <Select
                options={difficultyOptions}
                variant="outline"
                color="yellow"
              />
            </div>

            <div className="form-field">
              <span className="form-label">Time Limit (seconds)</span>
              <div className="input-with-icon">
                <Input
                  name="timeLimit"
                  type="number"
                  min="1"
                  variant="outline"
                  color="yellow"
                  icon={<Timer size={14} />}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <span className="form-label">Memory Limit (MB)</span>
              <div className="input-with-icon">
                <Input
                  name="memoryLimit"
                  type="number"
                  min="1"
                  variant="outline"
                  color="yellow"
                  icon={<Database size={14} />}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Example Test Cases</h2>

            <Button onClick={addExample} color="yellow">
              <Plus size={14} />
              Add Example
            </Button>
          </div>

          {examples.map((example, index) => (
            <div key={example.id} className="input-group">
              <div className="group-subheader">
                Example {index + 1}
                <IconButton
                  ariaLabel="remove-example"
                  variant="ghost"
                  onClick={() => removeExample(example.id)}
                  icon={<X size={14} />}
                />
              </div>

              <div className="form-field">
                <span className="form-label">Input</span>
                <div className="input-with-icon">
                  <Input
                    value={example.input}
                    onChange={e =>
                      updateExample(example.id, "input", e.target.value)
                    }
                    icon={<Hash size={14} />}
                    variant="outline"
                    color="yellow"
                    placeholder="Example input"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <span className="form-label">Output</span>
                <div className="input-with-icon">
                  <Input
                    value={example.output}
                    onChange={e =>
                      updateExample(example.id, "output", e.target.value)
                    }
                    variant="outline"
                    color="yellow"
                    icon={<ListChecks size={14} />}
                    placeholder="Example output"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <span className="form-label">Explanation</span>
                <TextArea
                  value={example.explanation}
                  onChange={e =>
                    updateExample(example.id, "explanation", e.target.value)
                  }
                  variant="outline"
                  color="yellow"
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
            <div className="input-with-icon">
              <Input
                name="topics[]"
                icon={<Tag size={14} />}
                variant="outline"
                color="yellow"
                placeholder="Enter topics (comma separated)"
              />
            </div>
          </div>

          <div className="form-field">
            <span className="form-label">Hints</span>
            <div className="input-with-icon">
              <TextArea
                name="hints[]"
                variant="outline"
                color="yellow"
                placeholder="Enter hints (one per line)"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Editorial</h2>
          <div className="form-field">
            <span className="form-label">Editorial Content</span>
            <MarkdownEditor
              value={editorial}
              onChange={setEditorial}
              height={400}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" color="sky" disabled={loading}>
            <PlusCircle size={14} />
            Create Problem
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblem;
