import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/landing";
import Selection from "./pages/Selection";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";

export default function App() {
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in/*" element={<AuthPage mode="sign-in" />} />
        <Route path="/sign-up/*" element={<AuthPage mode="sign-up" />} />
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