import React from "react";
import { useState, useEffect } from "react";
import { socket } from "./socket";

import './GamePage.css'
import Hand from "./components/Hand/Hand"
import Foundation from "./components/Foundation/Foundation"

function GamePage() {
  const [room, setRoom] = useState("");
  const [playerId, setPlayerId] = useState(2);
  const leftId = (playerId + 1) % 4;
  const topId = (playerId + 2) % 4;
  const rightId = (playerId + 3) % 4;  
  const [hands, setHands] = useState([
    { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 0
    { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 1
    { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 2
    { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 3
  ]);
  const [foundation, setFoundation] = useState(Array(12).fill([]));
  const [curPts, setCurPts] = useState(0);
  // set pts list later?
  const [totalPts, setTotalPts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    function onRoomId(rId) {
      setRoom(rId);
    }

    function onDealHands(receivedHands) {
      console.log("[client] Hands received:", receivedHands);
      setHands(receivedHands);
    }

    function onPlayerNum(n) {
      console.log(`You are player ${n}`);
      setPlayerId(n);
    }

    function onUpdateHands(newHands) {
      console.log('hands updated:', newHands);
      setHands(newHands);
    }

    function onUpdateFoundation(newFoundation) {
      // console.log('foundation updated!');
      setFoundation(newFoundation);
    }

    function onScoreboardUpdate(tPts) {
      setTotalPts(tPts);
    }

    socket.on("roomId", onRoomId);
    socket.on("dealHands", onDealHands);
    socket.on("playerNum", onPlayerNum);
    socket.on("updateHands", onUpdateHands);
    socket.on("updateFoundation", onUpdateFoundation);
    socket.on("scoreboardUpdate", onScoreboardUpdate);
    return () => {
      socket.off("roomId", onRoomId);
      socket.off("dealHands", onDealHands);
      socket.off("playerNum", onPlayerNum);
      socket.off("updateHands", onUpdateHands);
      socket.off("updateFoundation", onUpdateFoundation);
      socket.off("scoreboardUpdate", onScoreboardUpdate);
    };
  }, []);

  const handleDraw = () => {
    // console.log("Handling draw!");
    socket.emit("drawCard");
  };

  // for the following functions, set data in emit, then let the backend handle it
  // finally, from the backend emit updateHands
  const handleDropOnTableau = (draggedCard, colIdx, cardSource, fromColIdx = -1) => {
    socket.emit("dropTableau");
  }

  const handleDropOnFoundation = (draggedCard, colIdx, cardSource, fromColIdx, topCard) => {
    socket.emit("dropFoundation");
  }

  const handlePounceClick = () => {
    socket.emit("pounce");
  }

  return (
    <>
      <div className="hand-wrapper hand-bottom">
        <Hand
          // handle the n = 4 case (set to zero here)
          data={hands[playerId % 4]}
          isLocalPlayer={true}
          onStockClick={handleDraw}
          onDropToTableau={handleDropOnTableau}
          onPounceClick={handlePounceClick}
        />
      </div>
      <div className="hand-wrapper hand-left">
        <Hand
            data={hands[leftId]}
            isLocalPlayer={false}
          />
      </div>
      <div className="hand-wrapper hand-top">
        <Hand
            data={hands[topId]}
            isLocalPlayer={false}
          />
      </div>
      <div className="hand-wrapper hand-right">
        <Hand
            data={hands[rightId]}
            isLocalPlayer={false}
          />
      </div>
      <Foundation foundationPiles={foundation} onDropToFoundation={handleDropOnFoundation}/>
    </>
  )
}

export default GamePage
