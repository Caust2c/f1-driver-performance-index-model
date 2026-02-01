import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Landing from "./pages/landing";

export default function App() {
  return (
    <Router>
      <div className="container mt-5">
        <Header />

        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}
