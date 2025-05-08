import * as roomUtils from "../utils/roomUtils.js";

const createRoom = (req, res) => {
  const roomId = roomUtils.generateId();
  roomUtils.createRoom(roomId);
  res.json({ roomId: roomId, userId: roomUtils.generateId() });
};

export { createRoom };
