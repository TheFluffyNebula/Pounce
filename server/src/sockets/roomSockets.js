import * as roomUtils from "../utils/roomUtils.js";
import { splitDeck, SUIT_TO_COLOR, VALUE_TO_NUMBER } from "../utils/createDeck.js";

// roomsData
const rD = {}; // Object to store room-specific data

export default (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);


    
  });
};
