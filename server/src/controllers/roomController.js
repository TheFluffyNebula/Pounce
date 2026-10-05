import * as roomUtils from "../utils/roomUtils.js";

// Normalize so "ABC " and "abc" are the same room — players type these by hand.
const normalize = (code) => String(code ?? "").trim().toLowerCase();

const createRoom = (req, res) => {
  const requested = normalize(req.body?.roomId);

  if (requested) {
    if (!/^[a-z0-9-]{1,16}$/.test(requested)) {
      return res.status(400).json({
        error: "Room codes can only use letters, numbers and dashes (max 16).",
      });
    }
    if (!roomUtils.createRoom(requested)) {
      return res.status(409).json({
        error: "That room code is already in use. Try another one.",
      });
    }
    return res.json({ roomId: requested });
  }

  // No code given: fall back to a generated one.
  let roomId = roomUtils.generateId().slice(0, 6);
  while (!roomUtils.createRoom(roomId)) {
    roomId = roomUtils.generateId().slice(0, 6);
  }
  res.json({ roomId });
};

export { createRoom };
