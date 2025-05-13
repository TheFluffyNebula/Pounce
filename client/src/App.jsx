import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { socket } from "./socket";
import HomePage from "./HomePage";
import GamePage from "./GamePage";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    function onConnect() {
      console.log("client connected");
    }

    function onJoin(status, roomId) {
      if (status == 0) {
        console.log("[client] room successfully joined!");
        navigate(`/room/${roomId}`);
      } else if (status == 1) {
        console.log("[client] room does not exist");
      } else if (status == 2) {
        console.log("[client] room is already full!");
      } else if (status == 3) {
        console.log("[client] room full, game is starting!");
      }
    }

    function onFinalCheck(roomId) {
      console.log("[client] final ready check");
      navigate(`/room/${roomId}`);
      // allow time for navigation
      setTimeout(() => { socket.emit("startGame"); }, 2000);
    }

    function onNextRound() {
      console.log("[client] next round!");
      socket.emit("startGame");
    }

    socket.on("connect", onConnect);
    socket.on("joinStatus", onJoin);
    socket.on("finalCheck", onFinalCheck);
    socket.on("nextRound", onNextRound);
    return () => {
      socket.off("connect", onConnect);
      socket.off("joinStatus", onJoin);
      socket.off("finalCheck", onFinalCheck);
      socket.off("nextRound", onNextRound);
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
