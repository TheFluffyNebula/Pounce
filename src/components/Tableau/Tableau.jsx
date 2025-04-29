import React from "react";

import './Tableau.css'
import TableauCardSlot from './TableauCardSlot.jsx'

// 7 columns of 13 card slots
// given 7 arrays, update the card slots of the corresponding piles
function Tableau({ tableauPiles, onDropToTableau }) {
    return (
        <div className="tableauContainer">
            {tableauPiles.map((pile, colIdx) => (
                <div className="tableauColumn" 
                     key={colIdx}
                     onDragOver={(e) => e.preventDefault()}
                     onDrop={(e) => {
                        e.preventDefault();
                        try {
                          const card = JSON.parse(e.dataTransfer.getData("card"));
                          const cardSource = JSON.parse(e.dataTransfer.getData("source"));
                          // console.log("Card dropped!", card);
                          const fromColIdx = JSON.parse(e.dataTransfer.getData("fromColIdx"));
                          // console.log(fromColIdx);
                          onDropToTableau(card, colIdx, cardSource, fromColIdx);
                        } catch {
                          // console.log("Invalid move!");
                        }
                     }}
                     >
                    {Array.from({ length: 13 }, (_, rowIdx) => {
                        const card = pile[rowIdx] || null;
                        const faceUp = card?.faceUp || false;
                        const topCard = rowIdx === pile.length - 1; // top card in the column
                        // console.log(topCard);

                        return (
                          <TableauCardSlot
                            key={rowIdx}
                            card={card}
                            faceUp={faceUp}
                            topCard={topCard}
                            colIdx={colIdx}
                            isEmptySlot={pile.length === 0 && rowIdx === 0}
                          />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default Tableau
