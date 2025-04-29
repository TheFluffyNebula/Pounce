import Card from "../Cards/Card";

function TableauCardSlot({ card, faceUp, topCard, colIdx, isEmptySlot }) {
  function handleDragStart(e) {
    // console.log("dragging!");
    e.dataTransfer.setData("card", JSON.stringify(card));
    e.dataTransfer.setData("source", JSON.stringify("tableau"));
    e.dataTransfer.setData("fromColIdx", JSON.stringify(colIdx));
    if (topCard) {
      e.dataTransfer.setData("topCard", JSON.stringify("true"));
    } else {
      e.dataTransfer.setData("topCard", JSON.stringify("false"));
    }
  }

  return (
    <div className="tableau-card-slot">
      {card ? (
        faceUp ? (
          <div draggable={faceUp} onDragStart={handleDragStart}>
            <Card card={card} />
          </div>
        ) : (
          <div className="card face-down" />
        )
      ) : (
        isEmptySlot ? (
          <div className="empty-tableau-column-slot" />
        ) : (
          <div className="empty-tableau-slot" />
        )
      )}
    </div>
  );
}

export default TableauCardSlot;
