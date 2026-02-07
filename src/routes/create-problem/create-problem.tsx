/**-- external --*/

import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button } from "antd";
import { PlusCircle } from "lucide-react";

/**-- internal --*/

import { useIsAdmin } from "@/stores/userStore";
import { Toast } from "@/lib/toast";
import { Topic } from "@/generated/graphql";

/**-- relative --*/

import "./create-problem.scss";
import BasicDetails from "./components/basic-details";
import Testcases from "./components/testcases";
import { createProblemMutation } from "./module/mutations";
import { handleSubmit, initialState } from "./module/utils";
import { getTopicsQuery } from "./module/queries";

const CreateProblem = () => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const [problemDetails, setProblemDetails] = useState(initialState);
  const [createProblem, { loading }] = useMutation(createProblemMutation);
  const { loading: topicsLoading, data } = useQuery(getTopicsQuery);

  const topicsData = _.get(data, "topics", []) as Topic[];

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

  const onSubmit = async () => {
    await handleSubmit({ problemDetails, navigate, createProblem });
  };

  return (
    <div className="create-problem">
      <h1>Create problem</h1>

      <div onSubmit={onSubmit}>
        <div className="problem-form">
          <BasicDetails
            problemDetails={problemDetails}
            topicsData={topicsData}
            topicsLoading={topicsLoading}
            updateField={updateField}
          />

          <Testcases
            problemDetails={problemDetails}
            updateField={updateField}
          />
        </div>

        <div className="form-actions">
          <Button
            disabled={loading}
            type="primary"
            color="geekblue"
            onClick={onSubmit}
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
