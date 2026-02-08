/**-- external --*/

import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button } from "antd";
import { PlusCircle, Upload } from "lucide-react";

/**-- internal --*/

import { useIsAdmin } from "@/stores/userStore";
import { Toast } from "@/lib/toast";
import { Problem, Topic } from "@/generated/graphql";

/**-- relative --*/

import "./upsert-problem.scss";
import BasicDetails from "./components/basic-details";
import Testcases from "./components/testcases";
import { createProblemMutation } from "./module/mutations";
import {
  handleSubmit,
  initializeProblemDetailsState,
  initialState,
} from "./module/utils";
import { getTopicsQuery, getProblemDetailsQuery } from "./module/queries";

const UpsertProblem = () => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const { slug } = useParams();

  const [problemDetails, setProblemDetails] = useState(initialState);
  const [createProblem, { loading }] = useMutation(createProblemMutation);
  const { loading: topicsLoading, data } = useQuery(getTopicsQuery);

  const {
    loading: isProblemDetailsLoading,
    data: problemDetailsData,
    error: problemDetailsError,
  } = useQuery(getProblemDetailsQuery, {
    variables: { slug },
    skip: !slug,
  });

  useEffect(() => {
    if (!isAdmin) {
      Toast.error("You don't have permission to access this page");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  } else if (isProblemDetailsLoading) {
    return <div>Loading...</div>;
  } else if (problemDetailsError) {
    Toast.error("Failed to load problem details");
    navigate("/practice");
  }

  if (problemDetailsData && slug) {
    const problem = _.get(
      problemDetailsData,
      "problem",
      null
    ) as Problem | null;

    if (problem && problemDetails === initialState) {
      const initializedState = initializeProblemDetailsState(problem);
      setProblemDetails(initializedState);
    }
  }

  const topicsData = _.get(data, "topics", []) as Topic[];

  const updateField = (field: keyof typeof initialState, value: unknown) => {
    setProblemDetails({
      ...problemDetails,
      [field]: value,
    });
  };

  const onSubmit = async () => {
    await handleSubmit({ problemDetails, navigate, createProblem });
  };

  const pageTitle = slug ? "Edit problem" : "Create problem";
  const actionLabel = slug ? "Update problem" : "Create problem";

  return (
    <div className="create-problem">
      <h1>{pageTitle}</h1>

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
            {slug ? <Upload size={14} /> : <PlusCircle size={14} />}
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpsertProblem;
