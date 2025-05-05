import Tableau from "../Tableau/Tableau"
import Stock from "../Stock/Stock"
import Waste from "../Waste/Waste"
import Pounce from "../Pounce/Pounce"
import "./Hand.css"

function Hand({
  data, isLocalPlayer, 
  onStockClick = () => {},
  onDropToTableau = () => {},
  onPounceClick = () => {},
  }) {
    console.log(isLocalPlayer);
    return (
      <div className="hand">
        <div className="leftContainer">
          <div className="drawContainer">
            <Stock stockPile={data.stockPile} onClick={isLocalPlayer? onStockClick : undefined} />
            <Waste wastePile={data.wastePile} />
          </div>
          <Pounce pouncePile={data.pouncePile} onClick={isLocalPlayer? onPounceClick : undefined} />
        </div>        
        <Tableau tableauPiles={data.tableau} onDrop={isLocalPlayer? onDropToTableau : undefined} />
      </div>
    );
}

export default Hand
