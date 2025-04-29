// console.log("Hello World!");

// stockPile implemented as a queue: idx = n - 1 is out first
// wastePile implemented as a stack: idx = n - 1 is out first
// a b c d e --> e d c b a
// if we hit zero stock, make new stock, add back in reverse order

export function drawCard(stockPile, wastePile) {
    if (stockPile.length > 0) {
        const newCard = stockPile[stockPile.length - 1];
        return {
          newStock: stockPile.slice(0, -1),
          newWaste: [...wastePile, newCard],
        };
    } else {
        return {
            newStock: [...wastePile].reverse(), 
            newWaste: []
        }
    }
}
