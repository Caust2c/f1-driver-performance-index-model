import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/landing";
import Selection from "./pages/Selection";
import Home from "./pages/Home";

export default function App() {
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/selection" 
          element={
            <Selection 
              selectedDrivers={selectedDrivers} 
              setSelectedDrivers={setSelectedDrivers} 
            />
          } 
        />
        <Route 
          path="/home" 
          element={<Home selectedDrivers={selectedDrivers} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}