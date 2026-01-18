/**-- external --*/

import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Editor } from "@monaco-editor/react";
import { Button, Input, Select } from "antd";
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

import { createProblemMutation } from "@/routes/problem/modules/queries";
import { useIsAdmin } from "@/stores/userStore";
import { Toast } from "@/lib/toast";
import { Problem } from "@/generated/graphql";
import MarkdownEditor from "@/components/ui/markdown-editor";

/**-- relative --*/

import "./create-problem.scss";
import { difficultyOptions, Example } from "./module/create-problem-utils";

const { TextArea } = Input;

const CreateProblem = () => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [createProblem, { loading }] = useMutation(createProblemMutation);

  const [difficulty, setDifficulty] = useState<string>();
  const [description, setDescription] = useState("");
  const [editorial, setEditorial] = useState("");
  const [examples, setExamples] = useState<Example[]>([
    { id: "1", input: "", output: "", explanation: "" },
  ]);

  const [prefersDarkTheme, setPrefersDarkTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) =>
      setPrefersDarkTheme(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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
    const editorialTitle = formData.get("editorialTitle") as string;

    try {
      const input = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        description,
        difficulty,
        timeLimitInSeconds: Number(formData.get("timeLimit")),
        memoryLimitInMB: Number(formData.get("memoryLimit")),
        examples: examples.map(({ input, output, explanation }) => ({
          input,
          output,
          explanation,
        })),
        hints: _.split(formData.getAll("hints") as unknown as string, "\n"),
        topics: [],
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

  return (
    <div className="create-problem">
      <h1>Create problem</h1>

      <form onSubmit={handleSubmit}>
        <div className="problem-form">
          <div className="basic-details">
            <div className="form-section">
              <h2>Basic information</h2>

              <div className="form-field">
                <span className="form-label">Problem Title</span>
                <div className="input-with-icon">
                  <Input
                    name="title"
                    placeholder="Search for a problem"
                    prefix={<AlignLeft size={14} />}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <span className="form-label">Slug (for routing)</span>
                <div className="input-with-icon">
                  <Input
                    name="slug"
                    placeholder="Enter problem slug"
                    prefix={<Globe size={14} />}
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
                    placeholder="Select difficulty"
                    value={difficulty}
                    options={difficultyOptions}
                    onChange={setDifficulty}
                    className="select-difficulty"
                  />
                </div>

                <div className="form-field">
                  <span className="form-label">Time Limit (seconds)</span>
                  <div className="input-with-icon">
                    <Input
                      name="timeLimit"
                      type="number"
                      min="1"
                      prefix={<Timer size={14} />}
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
                      prefix={<Database size={14} />}
                      required
                    />
                  </div>
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
                    <div className="input-with-icon">
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
                  </div>

                  <div className="form-field">
                    <span className="form-label">Output</span>
                    <div className="input-with-icon">
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
                  </div>

                  <div className="form-field">
                    <span className="form-label">Explanation</span>
                    <TextArea
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
                <div className="input-with-icon">
                  <Input
                    name="topics[]"
                    prefix={<Tag size={14} />}
                    placeholder="Enter topics (comma separated)"
                  />
                </div>
              </div>

              <div className="form-field">
                <span className="form-label">Hints</span>
                <div className="input-with-icon">
                  <TextArea
                    name="hints"
                    placeholder="Enter hints (one per line)"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="form-section form-section-without-border">
              <h2>Editorial (optional)</h2>

              <div className="form-field">
                <span className="form-label">Editorial title</span>
                <div className="input-with-icon">
                  <Input
                    name="editorialTitle"
                    placeholder="Enter editorial title"
                    prefix={<Lightbulb size={14} />}
                  />
                </div>
              </div>

              <div className="form-field">
                <span className="form-label">Editorial Content</span>
                <MarkdownEditor
                  value={editorial}
                  onChange={setEditorial}
                  height={400}
                />
              </div>
            </div>
          </div>

          <div className="solutions-editor">
            <Editor
              height="100%"
              defaultLanguage="python"
              language={"cpp"}
              value={"sdvfd"}
              onChange={() => {}}
              theme={prefersDarkTheme ? "vs-dark" : "light"}
              options={{
                fontFamily: "JetBrains Mono, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                fontSize: 13.5,
                lineHeight: 1.6,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                wrappingStrategy: "advanced",
              }}
              // onMount={handleEditorDidMount}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button disabled={loading} type="primary" color="geekblue">
            <PlusCircle size={14} />
            Create problem
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblem;
