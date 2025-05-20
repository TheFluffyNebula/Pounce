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
      // console.log("[server] drawing for player", playerId);
      // console.log(playerHand.wastePile);
      const { newStock, newWaste } = roomUtils.drawCard(playerHand.stockPile, playerHand.wastePile);
      // console.log(playerHand);
      rD[rId].hands = {
        ...rD[rId].hands,
        [playerId]: {
          ...playerHand,
          stockPile: newStock,
          wastePile: newWaste,
        },
      };

      io.to(rId).emit("updateHands", rD[rId].hands);
    });

    socket.on("dropTableau", (data) => {
      const rId = socket.data.roomId;
      const players = roomUtils.getPlayersInRoom(rId);
      const playerId = players.indexOf(socket.id);
      // console.log(data);
      const draggedCard = data.draggedCard;
      const colIdx = data.colIdx;
      const cardSource = data.cardSource;
      const fromColIdx = data.fromColIdx;

      const playerHand = rD[rId].hands[playerId];
      function wasteToTableau() {
        // console.log("waste to tableau");
        // Make a copy of wastePile and tableau
        const newWaste = [...playerHand.wastePile];
        const cardToMove = newWaste.pop(); // remove top card from waste
        cardToMove.faceUp = true;

        const newTableau = [...playerHand.tableau];
        const updatedColumn = [...newTableau[colIdx], cardToMove]; // add card to the target column
        newTableau[colIdx] = updatedColumn;

        rD[rId].hands = {
          ...rD[rId].hands,
          [playerId]: {
            ...playerHand,
            wastePile: newWaste,
            tableau: newTableau
          },
        };
        io.to(rId).emit("updateHands", rD[rId].hands);
      }

      function pounceToTableau() {
        // console.log("pounce to tableau!");
        // same as waste -> tableau
        // Make a copy of pouncePile and tableau
        const newPounce = [...playerHand.pouncePile];
        const cardToMove = newPounce.pop(); // remove top card from waste
        cardToMove.faceUp = true;

        const newTableau = [...playerHand.tableau];
        const updatedColumn = [...newTableau[colIdx], cardToMove]; // add card to the target column
        newTableau[colIdx] = updatedColumn;

        rD[rId].hands = {
          ...rD[rId].hands,
          [playerId]: {
            ...playerHand,
            pouncePile: newPounce,
            tableau: newTableau
          },
        };
        io.to(rId).emit("updateHands", rD[rId].hands);
      }

      // information we have: colIdx (drop location)
      function tableauToTableau() {
        // console.log("Card from column", fromColIdx);
        if (fromColIdx == -1) {
          console.log("tableau-to-tableau: fromCol = -1");
          return;
        }
        if (fromColIdx == colIdx) {
          return;
        }
        // valid move: move all cards from tableau[fromColIdx] past the card to tableau[colIdx]
        // console.log("Valid move!");
        const newTableau = [...playerHand.tableau];
        let tab1 = [...playerHand.tableau[fromColIdx]];
        let tab2 = [...playerHand.tableau[colIdx]];
        // moving from tab1 onto tab2
        const idx = newTableau[fromColIdx].findIndex(
          (c) => c.suit === draggedCard.suit && c.value === draggedCard.value
        );
        const numsToMove = tab1.slice(idx);
        tab1 = tab1.slice(0, idx);
        // make the card under it face up
        if (tab1.length > 0) {
          tab1[tab1.length - 1].faceUp = true;
        }
        tab2 = [...tab2, ...numsToMove]
        newTableau[fromColIdx] = tab1;
        newTableau[colIdx] = tab2;
        rD[rId].hands = {
          ...rD[rId].hands,
          [playerId]: {
            ...playerHand,
            tableau: newTableau
          },
        };
        io.to(rId).emit("updateHands", rD[rId].hands);
      }

      // console.log("App hDOT", draggedCard, colIdx, cardSource);
      if (!draggedCard) {
        return;
      }

      // common functionality: if king, put into empty slot regardless of source (waste, tableau, foundation)
      const color = SUIT_TO_COLOR[draggedCard.suit];
      const value = VALUE_TO_NUMBER[draggedCard.value];
      // console.log(value);

      const tableauCard = playerHand.tableau.at(colIdx).at(-1);
      // console.log("App hDOT", draggedCard, colIdx, cardSource);
      if (!tableauCard) {
        if (cardSource == "pounce") {
          // any pounce card can be moved into an empty space
          pounceToTableau();
        } else {
          // if it's from waste or tableau, it'd better be a king
          if (value != 13) {
            return;
          }  
        }
        // move the king to the empty square
        if (cardSource == "waste") {
          wasteToTableau();
        } else if (cardSource == "tableau") {
          // console.log("Hey!!");
          tableauToTableau();
        }
        return;
      }

      // common functionality: checking if it's a valid move
      const tableauColor = SUIT_TO_COLOR[tableauCard.suit];
      const tableauValue = VALUE_TO_NUMBER[tableauCard.value];
      // console.log(tableauColor, tableauValue);
      if (color == tableauColor || tableauValue - value != 1) {
        return;
      }
      // console.log("Valid move!");

      if (cardSource == "waste") {      
        wasteToTableau();
      } else if (cardSource == "tableau") {
        // console.log("Hey!!");
        tableauToTableau();
      }
      // can't move pounce to tableau unless empty
    });
    socket.on("dropFoundation", (data) => {
      const rId = socket.data.roomId;
      const players = roomUtils.getPlayersInRoom(rId);
      const playerId = players.indexOf(socket.id);
      // console.log(data);
      const draggedCard = data.draggedCard;
      const colIdx = data.colIdx;
      const cardSource = data.cardSource;
      const fromColIdx = data.fromColIdx;
      

    });
  });
};
