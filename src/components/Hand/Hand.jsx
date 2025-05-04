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
        <div className="leftContainer">
          <div className="drawContainer">
            <Stock stockPile={stockPile} onClick={onStockClick} />
            <Waste wastePile={wastePile} onDrop={onDropToWaste} />
          </div>
          <Pounce pouncePile={pouncePile} onClick={onPounceClick} />
        </div>        
        <Tableau tableauPiles={tableau} onDrop={onDropToTableau} />      
      </div>
    );
}

export default Hand
