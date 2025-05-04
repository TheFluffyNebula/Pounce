import Tableau from "../Tableau/Tableau"
import Stock from "../Stock/Stock"
import Waste from "../Waste/Waste"
import Pounce from "../Pounce/Pounce"
import "./Hand.css"

function Hand({
    stockPile, onStockClick,
    wastePile, onDropToWaste,
    tableau, onDropToTableau,
    pouncePile, onPounceClick}) {
    return (
      <div className="hand">
        <div className="drawContainer">
          <Stock stockPile={stockPile} onClick={onStockClick} />
          <Waste wastePile={wastePile} onDrop={onDropToWaste} />
        </div>
        <Tableau tableauPiles={tableau} onDrop={onDropToTableau} />
        <Pounce pouncePile={pouncePile} onClick={onPounceClick} />
      </div>
    );
}

export default Hand
