import React from "react";

import './Waste.css'
import Card from "../Cards/Card";

// if there's at least one card, render the last one
// if there's no card, visibility hidden
function Waste({ wastePile, drag }) {
    const hasCards = wastePile.length > 0;
    const card = hasCards ? wastePile.at(-1) : null;

    function handleDragStart(e) {
        // console.log("dragging!");
        e.dataTransfer.setData("card", JSON.stringify(card));
        e.dataTransfer.setData("source", JSON.stringify("waste"));
        e.dataTransfer.setData("fromColIdx", JSON.stringify(-1));
    }

    return (
        <div className="wasteContainer">
            {hasCards ? (
                <div draggable={drag} onDragStart={handleDragStart}>
                    <Card card={card} />
                </div>
            ) : (
                <div className="empty-waste-slot" />
            )}
        </div>
    );
}

export default Waste
