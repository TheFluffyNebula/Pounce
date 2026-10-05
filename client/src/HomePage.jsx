import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import './HomePage.css';

function HomePage() {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  // App.jsx handles the happy path (status 0/3); we only report the failures,
  // which previously went to the console and left the player staring at nothing.
  useEffect(() => {
    function onJoinStatus(status) {
      if (status == 1) {
        setError("No room with that code. Check it, or create it instead.");
      } else if (status == 2) {
        setError("That room already has 4 players.");
      }
    }
    socket.on("joinStatus", onJoinStatus);
    return () => socket.off("joinStatus", onJoinStatus);
  }, []);

  const createRoom = async () => {
    if (!roomId) {
      setError("Room code cannot be empty");
      return;
    }
    setError("");
    console.log(`Creating room ${roomId}`);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL || "https://pounce.onrender.com"}/api/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the typed code so the creator and their friends use the same one
        body: JSON.stringify({ roomId }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        socket.emit("join", data.roomId);
        console.log('Room created:', data);
      } else {
        setError(data.error || "Failed to create room. Try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Can't reach the server. Try again in a moment.");
    }
  };

  const joinRoom = () => {
    if (roomId === "") {
      setError("Room code cannot be empty");
      return;
    }
    setError("");
    console.log(`Joining room ${roomId}`);
    socket.emit("join", roomId);
  };

  return (
    <div className="homepage">
      <div className="homepage-title">
        <span className="homepage-suits">
          <span className="suit red">♥</span>
          <span className="suit black">♠</span>
        </span>
        <h1>Pounce</h1>
        <span className="homepage-suits">
          <span className="suit red">♦</span>
          <span className="suit black">♣</span>
        </span>
      </div>
      <div className="homepage-card">
        <input
          type="text"
          placeholder="Room code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="btn-create" onClick={createRoom}>Create Room</button>
        <hr className="homepage-divider" />
        <button className="btn-join" onClick={joinRoom}>Join Room</button>
        {error && <p className="homepage-error">{error}</p>}
      </div>
    </div>
  );
}

export default HomePage;
