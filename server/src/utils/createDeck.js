const SUITS = ["♠", "♣", "♥", "♦"];
const SUIT_TO_COLOR = {
  "♠": "black", 
  "♣": "black", 
  "♥": "red", 
  "♦": "red"
}
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const VALUE_TO_NUMBER = {
  "A": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  "J": 11,
  "Q": 12,
  "K": 13
}

const generateDeck = () => {
  // console.log("creating deck");
  const unshuffled = SUITS.flatMap((suit) => {
    return VALUES.map((value) => {
      return { suit, value, faceUp: false };
    });
  });
  // console.log(unshuffled);
  const shuffled = [...unshuffled];
  for (let i = 51; i > 0; i--) {
    const newIndex = Math.floor(Math.random() * (i + 1));
    const oldValue = shuffled[newIndex];
    shuffled[newIndex] = shuffled[i];
    shuffled[i] = oldValue;
  }
  // console.log(shuffled[0].suit);
  return shuffled;
};

const splitDeck = () => {
  let deck = generateDeck();
  // output format: 
  // tableau: 1, 2, 3, 4, 5, 6, 7
  // stock: 24
  let splitDeck = {
      tableau: Array.from({ length: 6 }, () => []),
      stock: [], 
      pounce: []
  }
  let cur = 0;
  for (let i = 0; i < 6; i++) {
      for (let j = 0; j <= i; j++) {
        if (j == i) {
          deck[cur].faceUp = true;
        }
        splitDeck.tableau[i].push(deck[cur++]);
      }
  }
  for (let i = 0; i < 9; i++) {
    splitDeck.pounce.push(deck[cur++]);
  }
  for (let i = 0; i < 22; i++) {
      splitDeck.stock.push(deck[cur++]);
  }
  // console.log(splitDeck)
  // console.log(splitDeck.tableau);
  return splitDeck;
}

export {splitDeck, SUIT_TO_COLOR, VALUE_TO_NUMBER}
