import { Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/navbar";
import Home from "./routes/home/home";
import Problem from "./routes/problem/problem";
import NotFound from "./routes/not-found/not-found";
import About from "./routes/about/about";
import Learn from "./routes/learn/learn";
import Practice from "./routes/practice/practice";
import Interviews from "./routes/interviews/interviews";
import Playground from "./routes/playground/playground";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/problem/:slug" element={<Problem />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
