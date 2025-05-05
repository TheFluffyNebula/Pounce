import React from "react";
import { useState, useEffect } from "react";

import './App.css'
// import Foundation from "./components/Foundation/Foundation"
import Hand from "./components/Hand/Hand"
import {splitDeck, VALUE_TO_NUMBER, SUIT_TO_COLOR} from "./js/createDeck"
import {drawCard} from "./js/gameLogic"

function App() {
  const playerId = 2;
  const leftId = (playerId + 1) % 4;
  const topId = (playerId + 2) % 4;
  const rightId = (playerId + 3) % 4;

  const [hands, setHands] = useState([
    { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 0
    { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 1
    { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 2
    { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 3
  ]);
  const [foundation, setFoundation] = useState([[], [], [], []])

  useEffect(() => {
    const newHands = [...hands];
    // Only run once on component mount
    for (let i = 0; i < 4; i++) {
      const deck = splitDeck();
      newHands[i].stockPile = deck.stock;
      newHands[i].tableau = deck.tableau;
      newHands[i].pouncePile = deck.pounce;
    }
    setHands(newHands);
    setFoundation([[], [], [], []]);
  }, []);
  

  const handleDraw = (e) => {
    // console.log("Handling draw!");
    const playerHand = hands[playerId];
    const { newStock, newWaste } = drawCard(playerHand.stockPile, playerHand.wastePile);

    const updatedHands = {
      ...hands,
      [playerId]: {
        ...playerHand,
        stockPile: newStock,
        wastePile: newWaste,
      },
    };

    setHands(updatedHands);
  };

  function handleDropOnTableau(draggedCard, colIdx, cardSource, fromColIdx = -1) {
    console.log("Hey!");
    function wasteToTableau() {
      // Make a copy of wastePile and tableau
      const newWaste = [...wastePile];
      const cardToMove = newWaste.pop(); // remove top card from waste
      cardToMove.faceUp = true;

      const newTableau = [...tableau];
      const updatedColumn = [...newTableau[colIdx], cardToMove]; // add card to the target column
      newTableau[colIdx] = updatedColumn;

      setWastePile(newWaste);
      setTableau(newTableau);
    }

    // information we have: colIdx (drop location)
    function tableauToTableau() {
      // console.log("Card from column", fromColIdx);
      if (fromColIdx == -1) {
        console.log("tableau-to-tableau: fromCol = -1");
        return;
      }
      if (fromColIdx == colIdx) {
        return;
      }
      // valid move: move all cards from tableau[fromColIdx] past the card to tableau[colIdx]
      console.log("Valid move!");
      // TODO: implement logic
      const newTableau = [...tableau];
      let tab1 = [...tableau[fromColIdx]];
      let tab2 = [...tableau[colIdx]];
      // moving from tab1 onto tab2
      const idx = newTableau[fromColIdx].findIndex(
        (c) => c.suit === draggedCard.suit && c.value === draggedCard.value
      );
      const numsToMove = tab1.slice(idx);
      tab1 = tab1.slice(0, idx);
      // make the card under it face up
      if (tab1.length > 0) {
        tab1[tab1.length - 1].faceUp = true;
      }
      tab2 = [...tab2, ...numsToMove]
      newTableau[fromColIdx] = tab1;
      newTableau[colIdx] = tab2;
      setTableau(newTableau);
    }

    function pounceToTableau() {

    }

    // console.log("App hDOT", draggedCard, colIdx, cardSource);
    if (!draggedCard) {
      return;
    }

    // common functionality: if king, put into empty slot regardless of source (waste, tableau, foundation)
    const color = SUIT_TO_COLOR[draggedCard.suit];
    const value = VALUE_TO_NUMBER[draggedCard.value];
    // console.log(value);

    const tableauCard = tableau.at(colIdx).at(-1);
    // console.log("App hDOT", draggedCard, colIdx, cardSource);
    if (!tableauCard) {
      if (cardSource == "pounce") {
        // any pounce card can be moved into an empty space
        pounceToTableau();
      } else {
        // if it's from waste or tableau, it'd better be a king
        if (value != 13) {
          return;
        }  
      }
      // move the king to the empty square
      if (cardSource == "waste") {
        wasteToTableau();
      } else if (cardSource == "tableau") {
        // console.log("Hey!!");
        tableauToTableau();
      }
      return;
    }

    // common functionality: checking if it's a valid move
    const tableauColor = SUIT_TO_COLOR[tableauCard.suit];
    const tableauValue = VALUE_TO_NUMBER[tableauCard.value];
    // console.log(tableauColor, tableauValue);
    if (color == tableauColor || tableauValue - value != 1) {
      return;
    }
    // console.log("Valid move!");

    if (cardSource == "waste") {      
      wasteToTableau();
    } else if (cardSource == "tableau") {
      // console.log("Hey!!");
      tableauToTableau();
    }
    // can't move pounce to tableau unless empty
  }

  function handleDropOnFoundation(draggedCard, colIdx, cardSource, fromColIdx, topCard) {
    function wasteToFoundation() {
      // Make a copy of wastePile and foundation
      const newWaste = [...wastePile];
      const cardToMove = newWaste.pop(); // remove top card from waste
      cardToMove.faceUp = true;

      const newFoundation = [...foundation];
      const updatedColumn = [...newFoundation[colIdx], cardToMove]; // add card to the target column
      newFoundation[colIdx] = updatedColumn;

      setWastePile(newWaste);
      setFoundation(newFoundation);
    }

    function tableauToFoundation() {
      // must be top tableau card
      if (!topCard) {
        return;
      }
      // move the top card from tableau[fromColIdx] to foundation[colIdx]
      // Make a copy of tableauPile and foundation
      const newTableau = [...tableau];
      let tab1 = [...tableau[fromColIdx]];
      const cardToMove = tab1.pop(); // remove top card from waste
      // make next card below face-up
      if (tab1.length > 0) {
        tab1.at(-1).faceUp = true;
      }
      newTableau[fromColIdx] = tab1;

      const newFoundation = [...foundation];
      const updatedColumn = [...newFoundation[colIdx], cardToMove]; // add card to the target column
      newFoundation[colIdx] = updatedColumn;

      setTableau(newTableau);
      setFoundation(newFoundation);
    }

    // console.log("App hDOF", draggedCard, colIdx, cardSource);
    if (!draggedCard) {
      return;
    }

    // common functionality: if ace, put into empty slot regardless of source (waste, tableau)
    const suit = draggedCard.suit;
    const value = VALUE_TO_NUMBER[draggedCard.value];
    // console.log(value);

    const foundationCard = foundation.at(colIdx).at(-1);
    // console.log("App hDOT", draggedCard, colIdx, cardSource);
    if (!foundationCard) {
      if (value != 1) {
        return;
      }
      // move the ace to the empty square
      if (cardSource == "waste") {
        wasteToFoundation();
      } else if (cardSource == "tableau") {
        tableauToFoundation();
      }
      return;
    }

    // common functionality: checking if it's a valid move
    const foundationSuit = foundationCard.suit;
    const foundationValue = VALUE_TO_NUMBER[foundationCard.value];
    // console.log(foundationColor, foundationValue);
    if (suit != foundationSuit || value - foundationValue != 1) {
      return;
    }
    // console.log("Valid move!");

    if (cardSource == "waste") {      
      wasteToFoundation();
    } else if (cardSource == "tableau") {
      tableauToFoundation();
    }
  }

  function handlePounceClick() {
    console.log("Player has pounced!");
  }

  return (
    <>
      <div className="hand-wrapper hand-bottom">
        <Hand
          data={hands[playerId]}
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
    </>
  )
}

export default App
