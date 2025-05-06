import React from "react";

import './Pounce.css'
import Card from "../Cards/Card";

// if there's at least one card, render the last one
// if there's no card, visibility hidden
function Pounce({ pouncePile, handlePounceClick, drag }) {
    const hasCards = pouncePile.length > 0;
    const card = hasCards ? pouncePile.at(-1) : null;

    function handleDragStart(e) {
        console.log("dragging!");
        e.dataTransfer.setData("card", JSON.stringify(card));
        e.dataTransfer.setData("source", JSON.stringify("pounce"));     
        e.dataTransfer.setData("fromColIdx", JSON.stringify(-1));   
    }

    return (
        <div className="pounceContainer">
            {hasCards ? (
                <div draggable={drag} onDragStart={handleDragStart}>
                    <Card card={card} />
                </div>
            ) : (
                <div className="empty-pounce-slot" onClick={handlePounceClick}>
                    Pounce!
                </div>
            )}
        </div>
    );
}

export default Pounce
