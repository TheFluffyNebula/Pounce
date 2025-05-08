import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { socket } from "./socket";
import HomePage from "./HomePage";
import GamePage from "./GamePage";

function App() {
  const navigate = useNavigate();
  useEffect(() => {

    return () => {

    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomId" element={<GamePage />} />
    </Routes>
  );
}

export default App;
