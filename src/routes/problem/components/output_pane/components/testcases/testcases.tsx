import { useState } from "react";
import { Play } from "lucide-react";
import "./testcases.scss";

type Props = {
  loading: boolean;
};

// Dummy test case for development
const defaultTestCase = {
  input: "nums = [2,7,11,15], target = 9",
  output: "[0,1]",
  explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
};

const Testcases = ({ loading }: Props) => {
  const [customInput, setCustomInput] = useState(defaultTestCase.input);
  const [runOutput, setRunOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    // Simulate execution delay
    setTimeout(() => {
      setRunOutput("✅ Success\n\nOutput: [0, 1]\nTime: 52ms\nMemory: 42.3 MB");
      setIsRunning(false);
    }, 1000);
  };

  if (loading) return <div className="testcases">Loading...</div>;

  return (
    <div className="testcases">
      <div className="input_section">
        <div className="section_header">
          <h3>Test Case</h3>
          <button
            className="run_button"
            onClick={handleRun}
            disabled={isRunning}
          >
            <Play size={14} />
            Run
          </button>
        </div>
        <textarea
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          className="input_editor"
          placeholder="Enter your test case..."
          spellCheck={false}
        />
      </div>

      <div className="output_section">
        <div className="section_header">
          <h3>Output</h3>
        </div>
        <pre className="output_display">
          {isRunning ? "Running..." : runOutput}
        </pre>
      </div>
    </div>
  );
};

export default Testcases;
