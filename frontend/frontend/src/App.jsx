import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Landing from "./pages/landing";

export default function App() {
  return (
    <Router>
      <div> 
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}