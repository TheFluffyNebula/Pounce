import './Foundation.css'
import FoundationCardSlot from './FoundationCardSlot.jsx'

function Foundation({ foundationPiles, onDropToFoundation }) {
    function safeGetData(e, key, defaultValue) {
        try {
          const data = e.dataTransfer.getData(key);
          return data ? JSON.parse(data) : defaultValue;
        } catch {
          return defaultValue;
        }
    }
    return (
        <div className="foundationContainer">
            {foundationPiles.map((pile, idx) => {
                const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
                return (
                    <div className="foundationPile" 
                        key={idx}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            try {
                                const card = JSON.parse(e.dataTransfer.getData("card"));
                                const cardSource = JSON.parse(e.dataTransfer.getData("source"));
                                const fromColIdx = safeGetData(e, "fromColIdx", -1);
                                const topCard = safeGetData(e, "topCard", false);
                                // console.log("Card dropped!", card);
                                onDropToFoundation(card, idx, cardSource, fromColIdx, topCard);    
                            } catch {
                                // console.log("Invalid move!");
                            }
                        }}
                    >
                        <FoundationCardSlot card={topCard}/>
                    </div>
                );
            })}
        </div>
    )
}

export default Foundation
