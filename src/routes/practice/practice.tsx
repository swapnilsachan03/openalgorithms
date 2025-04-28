import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "generic-ds";
import { useIsAdmin } from "@/stores/userStore";

import "./practice.scss";

const Practice = () => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  return (
    <div className="practice">
      <div className="practice_header">
        <h1>Practice Problems</h1>
        {isAdmin && (
          <Button
            color="cyan"
            icon={<PlusCircle size={16} />}
            onClick={() => navigate("/problem/create")}
          >
            Create Problem
          </Button>
        )}
      </div>
      <div className="practice_content">
        {/* Problem list will be added here */}
        Coming soon...
      </div>
    </div>
  );
};

export default Practice;
