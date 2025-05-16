import * as roomUtils from "../utils/roomUtils.js";
import { splitDeck, SUIT_TO_COLOR, VALUE_TO_NUMBER } from "../utils/createDeck.js";

// roomsData
const rD = {}; // Object to store room-specific data

export default (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

        socket.on("join", (roomId) => {
      socket.join(roomId);
      // Store roomId on the socket object
      socket.data.roomId = roomId;
      const result = roomUtils.joinRoom(roomId, socket.id);
      if (result == 0) {
        console.log("[server] room successfully joined!");
      } else if (result == 1) {
        console.log("[server] room does not exist");
      } else if (result == 2) {
        console.log("[server] room is already full");
      } else if (result == 3) {
        console.log("[server] final check!");
        // make sure the component is mounted so last joined
        // receives gets dealHand emit
        io.to(socket.id).emit("finalCheck", roomId);

        // here is a good spot to setup the room-specific data
        rD[roomId] = {
          // Cards to render
          hands: [{ stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 0
                  { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 1
                  { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }, // Player 2
                  { stockPile: [], wastePile: [], tableau: [], pouncePile: [] }], // Player 3
          foundation: Array(12).fill([]), // Center cards
          totalPts: [0, 0, 0, 0], // Total points for each player
        };
        return; // don't go here twice
      }
      // console.log("emitting joinStatus");
      io.to(socket.id).emit("joinStatus", result, roomId);
    });

    socket.on("startGame", () => {
      const rId = socket.data.roomId;
      // let the client know the room id
      io.to(rId).emit("roomId", rId);

      // Get all players in the room
      const players = roomUtils.getPlayersInRoom(rId);

      // Let players know which hand they have
      players.forEach((player, index) => {
        const deck = splitDeck();
        rD[rId].hands[index].stockPile = deck.stock;
        rD[rId].hands[index].tableau = deck.tableau;
        rD[rId].hands[index].pouncePile = deck.pounce;        
        // Emit the player number to the specific player
        io.to(player).emit("playerNum", index + 1);
      });
      // console.log(rD[rId].hands);
      console.log("[server] Cards dealt to players");
      // Emit the hands to everyone
      io.to(rId).emit("dealHands", rD[rId].hands);
    });

    socket.on("drawCard", () => {
      const rId = socket.data.roomId;
      const players = roomUtils.getPlayersInRoom(rId);
      const playerId = players.indexOf(socket.id);
      const playerHand = rD[rId].hands[playerId];
      const { newStock, newWaste } = roomUtils.drawCard(playerHand.stockPile, playerHand.wastePile);

      const updatedHands = {
        ...rD[rId].hands,
        [playerId]: {
          ...playerHand,
          stockPile: newStock,
          wastePile: newWaste,
        },
      };

      io.to(rId).emit("updateHands", updatedHands)
    });
  });
};
