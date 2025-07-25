import React from "react";
import { useState, useEffect } from "react";
import { socket } from "./socket";

import './GamePage.css'
import Hand from "./components/Hand/Hand"
import Foundation from "./components/Foundation/Foundation"
import Scoreboard from "./components/Scoreboard/Scoreboard"
import ServerMsg from "./components/Scoreboard/ServerMsg";

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
  const [scores, setScores] = useState([[0], [0], [0], [0]]);
  const [serverMsg, setServerMsg] = useState("Welcome!");

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
      console.log('hands updated');
      setHands(newHands);
    }

    function onUpdateFoundation(newFoundation) {
      // console.log('foundation updated!');
      setFoundation(newFoundation);
    }

    function onScoreboardUpdate(cPts, tPts) {
      // console.log(cPts, tPts);
      const newScores = [...scores];
      // add both the rdPts and totalPts lines to the lists
      for (let i = 0; i < 4; i++) {
        newScores[i].push(cPts[i]);
        newScores[i].push(tPts[i]);
      }
      // console.log(newScores);
      setScores(newScores);
    }

    function onServerMsg(msg) {
      // console.log('new server message!');
      setServerMsg(msg);
    }

    socket.on("roomId", onRoomId);
    socket.on("dealHands", onDealHands);
    socket.on("playerNum", onPlayerNum);
    socket.on("updateHands", onUpdateHands);
    socket.on("updateFoundation", onUpdateFoundation);
    socket.on("updateScores", onScoreboardUpdate);
    socket.on("serverMsg", onServerMsg);
    return () => {
      socket.off("roomId", onRoomId);
      socket.off("dealHands", onDealHands);
      socket.off("playerNum", onPlayerNum);
      socket.off("updateHands", onUpdateHands);
      socket.off("updateFoundation", onUpdateFoundation);
      socket.off("updateScores", onScoreboardUpdate);
      socket.off("serverMsg", onServerMsg);
    };
    // question: does the dependency array have to have {hands, foundation} in it?
  }, []);

  const handleDraw = () => {
    // console.log("Handling draw!", playerId);
    socket.emit("drawCard");
  };

  // for the following functions, set data in emit, then let the backend handle it
  // finally, from the backend emit updateHands
  const handleDropOnTableau = (draggedCard, colIdx, cardSource, fromColIdx = -1) => {
    const data = {
      draggedCard: draggedCard, 
      colIdx: colIdx, 
      cardSource: cardSource, 
      fromColIdx: fromColIdx
    }
    socket.emit("dropTableau", data);
  }

  const handleDropOnFoundation = (draggedCard, colIdx, cardSource, fromColIdx, topCard) => {
    const data = {
      draggedCard: draggedCard, 
      colIdx: colIdx, 
      cardSource: cardSource, 
      fromColIdx: fromColIdx, 
      topCard: topCard
    }
    socket.emit("dropFoundation", data);
  }

  const handlePounceClick = () => {
    console.log("[client] player has pounced");
    socket.emit("pounce");
  }

  return (
    <>
      <div className="gamepage-container">
        <div className="server-msg-wrapper">
          <ServerMsg msg={serverMsg}/>
        </div>
        <div className="playing-field">
          <div className="hand-wrapper hand-bottom">
            <Hand
              // handle the n = 4 case (set to zero here)
              data={hands[(playerId + 3) % 4]}
              isLocalPlayer={true}
              onStockClick={handleDraw}
              onDropToTableau={handleDropOnTableau}
              onPounceClick={handlePounceClick}
              />
          </div>
          <div className="hand-wrapper hand-left">
            <Hand
                data={hands[(leftId + 3) % 4]}
                isLocalPlayer={false}
                />
          </div>
          <div className="hand-wrapper hand-top">
            <Hand
                data={hands[(topId + 3) % 4]}
                isLocalPlayer={false}
                />
          </div>
          <div className="hand-wrapper hand-right">
            <Hand
                data={hands[(rightId + 3) % 4]}
                isLocalPlayer={false}
                />
          </div>
          <Foundation foundationPiles={foundation} onDropToFoundation={handleDropOnFoundation}/>
        </div>
        <div className="scoreboard">
          <Scoreboard scores={scores} playerId={playerId % 4}></Scoreboard>
        </div>
      </div>
    </>
  )
}

export default GamePage
