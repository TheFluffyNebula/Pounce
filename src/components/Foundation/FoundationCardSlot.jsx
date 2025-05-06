import Card from "../Cards/Card";

function FoundationCardSlot({ card }) {
  // console.log(card);
  return (
    <div className="foundation-card-slot" draggable={true}>
      {card ? (
        <Card card={card} /> 
      ) : (
        <div className="empty-foundation-slot" />
      )}
    </div>
  );
}

export default FoundationCardSlot;
