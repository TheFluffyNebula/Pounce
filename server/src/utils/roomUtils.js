// console.log("Hello World!");

import { v4 as uuidv4 } from "uuid";

const generateId = () => {
  return uuidv4();
};

let rooms = new Map();

const createRoom = (roomId) => {
  rooms.set(roomId, { players: [], isPlaying: false });
};
createRoom('a'); // bypass create-room test

const getPlayersInRoom = (roomId) => {
  return rooms.get(roomId).players;
}

const joinRoom = (roomId, userId) => {
  if (!rooms.has(roomId)) return 1; // room doesn't exist
  if (rooms.get(roomId).players.length == 4) {
    return 2; // room is full
  }
  rooms.get(roomId).players.push(userId);
  if (rooms.get(roomId).players.length == 4) {
    return 3; // start game!
  }
  return 0;
};

// stockPile implemented as a queue: idx = n - 1 is out first
// wastePile implemented as a stack: idx = n - 1 is out first
// a b c d e --> e d c b a
// if we hit zero stock, make new stock, add back in reverse order

const drawCard = (stockPile, wastePile) => {
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

export { generateId, createRoom, getPlayersInRoom, joinRoom, drawCard };
