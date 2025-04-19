import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

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

function App() {
  const location = useLocation();

  useEffect(() => {
    const isProblemPage =
      location.pathname.startsWith("/problem/") &&
      !location.pathname.includes("/create");

    if (isProblemPage) {
      document.body.classList.add("problem-page-body");
    } else {
      document.body.classList.remove("problem-page-body");
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/problem/:slug" element={<Problem />} />
        <Route path="/problem/create" element={<CreateProblem />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
