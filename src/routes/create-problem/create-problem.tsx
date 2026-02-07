/**-- external --*/

import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { Button } from "antd";
import { PlusCircle } from "lucide-react";

/**-- internal --*/

import { useIsAdmin } from "@/stores/userStore";
import { Toast } from "@/lib/toast";
import { Problem, Topic } from "@/generated/graphql";

/**-- relative --*/

import "./create-problem.scss";
import BasicDetails from "./components/basic-details";
import Testcases from "./components/testcases";
import { createProblemMutation } from "./module/mutations";
import {
  handleSubmit,
  initializeProblemDetailsState,
  initialState,
} from "./module/utils";
import { getTopicsQuery, getProblemBySlugQuery } from "./module/queries";

const CreateProblem = () => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const { slug } = useParams();

  const [problemDetails, setProblemDetails] = useState(initialState);
  const [createProblem, { loading }] = useMutation(createProblemMutation);
  const { loading: topicsLoading, data } = useQuery(getTopicsQuery);

  const [
    getProblemDetails,
    { loading: getProblemDetailsLoading, data: getProblemBySlug },
  ] = useLazyQuery(getProblemBySlugQuery);

  const topicsData = _.get(data, "topics", []) as Topic[];

  useEffect(() => {
    if (!isAdmin) {
      Toast.error("You don't have permission to access this page");
      navigate("/");
    }

    if (slug) {
      getProblemDetails({
        variables: { slug },
      });
    }
  }, [isAdmin, navigate, slug, getProblemDetails]);

  if (slug && !getProblemDetailsLoading && getProblemBySlug) {
    const problem = _.get(getProblemBySlug, "problem", {}) as Problem;

    if (!_.isEmpty(problem)) {
      const initializedState = initializeProblemDetailsState(problem);

      if (!_.isEqual(initializedState, problemDetails)) {
        setProblemDetails(initializedState);
      }
    } else {
      Toast.error("Problem not found");
      navigate("/");
    }
  }

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

  if (getProblemDetailsLoading) {
    return <div>Loading...</div>;
  }

  const pageTitle = slug ? "Edit problem" : "Create problem";

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
            <PlusCircle size={14} />
            Create problem
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProblem;
