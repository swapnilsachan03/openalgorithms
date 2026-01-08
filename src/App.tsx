import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client/react";

import { getApolloClient } from "./lib/apolloClient";
import { useUserToken } from "./stores/userStore";

import RouteWrapper from "@/components/layout/route_wrapper";

import Navbar from "./components/layout/navbar";
import Home from "./routes/home/home";
import Problem from "./routes/problem/problem";
import NotFound from "./routes/not-found/not-found";
import About from "./routes/about/about";
import Learn from "./routes/learn/learn";
import Practice from "./routes/practice/practice";
import Interviews from "./routes/interviews/interviews";
import Playground from "./routes/playground/playground";
import CreateProblem from "./routes/create-problem/create-problem";
import Login from "./routes/login/login";
import SignUp from "./routes/signup/signup";

function App() {
  const [isProblemPage, setIsProblemPage] = useState(false);

  useEffect(() => {
    if (isProblemPage) {
      document.body.classList.add("problem-page-body");
    } else {
      document.body.classList.remove("problem-page-body");
    }
  }, [isProblemPage]);

  const token = useUserToken();
  const client = getApolloClient(token);

  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={
            <RouteWrapper isAuthRoute>
              <Login />
            </RouteWrapper>
          }
        />

        <Route
          path="/signup"
          element={
            <RouteWrapper isAuthRoute>
              <SignUp />
            </RouteWrapper>
          }
        />

        <Route
          path="/problem/:slug"
          element={<Problem setIsProblemPage={setIsProblemPage} />}
        />

        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/create-problem" element={<CreateProblem />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-right" />
    </ApolloProvider>
  );
}

export default App;
