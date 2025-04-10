import "./result.scss";

type Props = {
  loading: boolean;
};

const Result = ({ loading }: Props) => {
  if (loading) return <div className="result">Loading...</div>;

  return (
    <div className="result">
      <pre className="result_output">
        {"> Running test cases...\n> All test cases passed!"}
      </pre>
    </div>
  );
};

export default Result;
