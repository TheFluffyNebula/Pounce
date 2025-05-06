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
    // console.log(data);
    return (
      <div className="hand">
        <div className="leftContainer">
          <div className="drawContainer">
            <Stock stockPile={data.stockPile} onClick={isLocalPlayer? onStockClick : undefined} />
            <Waste wastePile={data.wastePile} drag={isLocalPlayer} />
          </div>
          <Pounce pouncePile={data.pouncePile} handlePounceClick={isLocalPlayer? onPounceClick : undefined} drag={isLocalPlayer} />
        </div>        
        <Tableau tableauPiles={data.tableau} onDropToTableau={isLocalPlayer? onDropToTableau : undefined} drag={isLocalPlayer} />
      </div>
    );
}

export default Hand
